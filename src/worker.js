/**
 * worker.ts
 * A Cloudflare edge hosted Worker for Bootstrap UI development.
 */


String.prototype.capitalizeFirstChar = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

//  Import modules
import { rawHtmlResponse } from './std'
import { Page } from './dom'
import { Hono } from 'hono'

var ENV = {
	siteTitle: 'CF Starter Demo',
	brand: 'Cloudflare Starter Worker Demo',
	copyright: 'Blaine Harper',
	navbar: [{
		text: 'About',
		links: [{
			text: 'Developer',
			link: '/developer'
		}, {
			text: 'Other Projects',
			link: '/projects'
		
		}, {
			text: 'Login',
			link: '/login'

		}, {
			text: '/Api/F1/Driver',
			link: '/api/f1/driver'
		},{
			text: '/Api/F1/Drivers/Driver',
			link: '/api/f1/drivers/driver'
		}, {
			text: 'Drivers/:Year',
			link: 'drivers/year'
		}],
	}]
}

// 	set application default's for page generation
//	Page will use this as the default contents for <head></head> unless overwritten with Page.header
const _headerDef = `<meta name = "viewport" content = "width=device-width,initial-scale=1"/>
	<link rel="icon" type="image/x-icon" href="https://bhar2254.github.io/src/img/ihcc/favicon.ico">

	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://parking.indianhills.edu/stylesheets/bs.add.css">

	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"><\/script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"><\/script>
	<script src="/js/jQuery.dirty.js"><\/script>
	<script src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.13.4/b-2.3.6/b-html5-2.3.6/b-print-2.3.6/datatables.min.js"><\/script>
	<script src="https://kit.fontawesome.com/5496aaa581.js" crossorigin="anonymous"><\/script>`

const _copyright = `<span id = "footerText"><span id="year"></span> © ${ENV.copyright}</span>
	<script>document.getElementById("year").innerHTML = new Date().getFullYear();</script>`

const _footerDef = `<div class="mx-auto">
		<div id="footer_motto" class="mx-auto poh-left-bar p-3 shadow-lg poh-sand bg-gradient text-center panel rounded-0" style="width:15%; min-width:10rem; margin-bottom:7.5rem;">
			<i>Start your own Cloudflare worker site <a href="https://github.com/bhar2254/Cloudflare-Workers-Starter">here!</a></i>
		</div>
		</div >
	</div >
	<footer id="mainFooter" class="mx-auto shadow-lg p-2 text-center poh-light-grey bg-gradient sticky-footer">
		${_copyright}
	</footer>	
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"><\/script>`

const pageDefaults = {
	...ENV, 
	header: _headerDef, 
	footer: _footerDef,
}
Page.setDefs(pageDefaults)

const colors = {
	'red': { primary: '782F40', secondary: 'FFA400' },
	'blue': { primary: '001E38', secondary: 'F7C564' },
	'green': { primary: '01504A', secondary: 'FFC600' },
	'purple': { primary: '301934', secondary: 'FFA400' },
	'orange': { primary: 'C04000', secondary: 'F7C564' },
}

const applyCSSTheme = (scheme) => {
	const hexToRBG = (hex) => {
		// Ensure the hex code is exactly 2 digits
		if (hex.length !== 6) {
			throw new Error('Invalid hex color format. It should be 6 digits.');
		}
		let output = parseInt(hex, 16)
		output = Math.floor(output)
		output = Math.min(255, Math.max(0, output))
		const rDecimalValue = parseInt(hex.substring(0, 2), 16)
		const gDecimalValue = parseInt(hex.substring(2, 4), 16)
		const bDecimalValue = parseInt(hex.substring(4, 6), 16)

		// Use the decimal value for each RGB component to create a shade of gray
		return `${rDecimalValue}, ${gDecimalValue}, ${bDecimalValue}`
	}
	if (!Object.keys(colors).includes(scheme))
		scheme = 'purple'
	const rbgPrimary = `${hexToRBG(colors[scheme].primary)}`
	const rbgSecondary = `${hexToRBG(colors[scheme].secondary)}`
	return `
		<style>
		:root{
			--poh-primary: #${colors[scheme].primary};
			--poh-primary-rgb: ${rbgPrimary};
			--poh-secondary: #${colors[scheme].secondary};
			--poh-secondary-rgb: ${rbgSecondary};
		}
		</style>`
}

const app = new Hono()

//	route handler
app.get('/', async c => {
	const page = new Page({
		page_title: 'Home',
		headerOverwrite: _headerDef + applyCSSTheme('red'),
		body: `<div class="p-3 text-center"><h2>Hello World!</h2<</div><br>
				<img class="p-3 mx-auto d-block rounded" src="https://bhar2254.github.io/src/img/ihcc/favicon.ico" style="max-width:100%; max-height: 25rem">`
	})
	return rawHtmlResponse(page.render())
})

app.get('/developer', async c => {
	const page = new Page({
		pageTitle: 'Developer', headerOverwrite: _headerDef + applyCSSTheme('purple'),
		body: `Hi! My name's Blaine. I make websites and other JavaScript applications. If you're interested in creating your own JavaScript projects like this one, check out my <a href="https://github.com/bhar2254">GitHub</a> or check out my site <a href="https://blaineharper.com">BlaineHarper.com</a> for (possibly?) up to date details.`
	})
	return rawHtmlResponse(page.render())
})

app.get('/projects', async c => {
	const page = new Page({
		pageTitle: 'Projects', headerOverwrite: _headerDef + applyCSSTheme('blue'),
		body: `If you'd like to view our other projects, check out our <a href="https://github.com/Indian-Hills-Community-College">GitHub</a>!`
	})
	return rawHtmlResponse(page.render())
})

app.notFound(c => {
	const page = new Page({
		pageTitle: '404 | Not Found!', headerOverwrite: _headerDef + applyCSSTheme('red'),
		body: `<span class="fs-3">404 Not Found!</span> <hr> PAGE NOT FOUND! Head <a href="/">home</a> to try and find what you're looking for.`
	})
	return rawHtmlResponse(page.render())
})

app.get('/drivers/:year', async c => {
	
	const year = c.req.param('year')
	console.log(year)
	const response = await app.request(`/api/f1/drivers/${year}`);

	let formula = await response.json()

	console.log()
	let body = '<div class="row g-4" </div>';
    for (const each of formula) {
		const pepsi = `${each.first_name.substring(0,3).toUpperCase()}${each.last_name.substring(0,3).toUpperCase()}`
        body += `<div class="col-lg-4 col-md-6 col-sm-12 mx-auto">
                <div class="card">
                    <div class="card-header text-center">
                        <div class="col-12 float-start">
                        	${each.first_name}  <strong>${each.last_name}</strong>
                        </div>
                        <div class="col-12 float-end">
                            <img src="https://flagsapi.com/AU/flat/32.png">
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row g-4">
                            <div class="text-center mx-auto col-lg-6 col-md-6 col-sm-8">
                                <a href="/drivers/profile/${each.first_name}-${each.last_name}"><img style="max-width:100%;" class="rounded-3 shadow-lg mb-3 border-0" 
								title="${each.first_name}/${each.last_name} headshot" 
								alt="${each.first_name}/ ${each.last_name} headshot" loading="eager" 
								src="https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/${each.first_name.substring(0,1)}/${pepsi}01_${each.first_name}_${each.last_name}/${pepsi}01.png.transform/5col/image.png"></a>
                            </div>
                            <div class="text-center mx-auto col-lg-6 col-md-6 col-sm-12">
                                <p class="border-top border-bottom py-1 h5 fw-bold" lang="en">
                                    3
                                </p>                                        
								<a href="/drivers/profile/api/f1/driver/${each.first_name}-${each.last_name}"><img style="max-width:100%;" class="rounded-3 shadow-lg mb-3 border-0" title="${each.first_name} ${each.last_name} headshot" alt="${each.first_name} ${each.last_name} headshot" loading="eager" src="https://media.formula1.com/d_default_fallback_image.png/content/dam/fom-website/2018-redesign-assets/drivers/number-logos/${pepsi}01.png"></a>
                            </div>      
                        </div>     
                    </div>          
                    <div class="card-footer">
                        <div class="row text-center">
							<div class="col-lg-6 col-md-9 p-1 my-3 mx-auto rounded-3" style="color: black; background-color:#6692FF">RB</div>
						</div>
                    </div>
                </div>
            </div>
`;
    }
    
    const page = new Page({
        formulaOneTitle: 'Drivers',
        headerOverwrite: _headerDef + applyCSSTheme('red'),
        body: body
	});
    
    return rawHtmlResponse(page.render());
});
	

app.get('/login', async c => {
    const page = new Page({
        pageTitle: 'Login',
        headerOverwrite: _headerDef + applyCSSTheme('green'),
        body: `
        <div class="card-body">
			<div id="message"></div> <!-- This is where login messages will appear -->
			<form id="loginForm" method="GET">
				<div class="mb-3">
					<label for="exampleInputEmail1" class="form-label">Email address</label>
					<input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
					<div id="emailHelp" class="form-text"></div>
				</div>
				<div class="mb-3">
					<label for="exampleInputPassword1" class="form-label">Password</label>
					<input type="password" name="password" class="form-control" id="exampleInputPassword1">
				</div>
				<button type="submit" class="btn poh-primary btn-block">Submit</button>
			</form>
		</div>
        `
    });
    return rawHtmlResponse(page.render());
});


app.get('/api/f1/driver', async c=>{
	const response = await fetch('https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158')
		return c.json (await response.json());

});


app.get('/api/f1/drivers/driver', async (c) => {
	

	let { first_name = 'max', last_name = 'verstappen' } = c.req.query()
	console.log()
	first_name = first_name.capitalizeFirstChar()
	last_name = last_name.capitalizeFirstChar()


    const response = await fetch(`https://api.openf1.org/v1/drivers?first_name=${first_name}&last_name=${last_name}&session_key=9158`);

    //const response = await fetch(`https://api.openf1.org/v1/drivers?broadcast_names=M_VERSTAPPEN&session_key=9158`);

	 return c.json (await response.json())

 });
 app.get('/api/f1/drivers/drivers', async (c) => {
	
    const response = await fetch(`https://api.openf1.org/v1/drivers`);

	const drivers = await response.json()
	
	let driverNames = []
	for (const each of drivers){
		if( driverNames.includes(each.full_name)){
			continue;
		}
		driverNames.push(each.full_name)
			
	}
    //const response = await fetch(`https://api.openf1.org/v1/drivers?broadcast_names=M_VERSTAPPEN&session_key=9158`);

	 return c.json (driverNames)

 });


 app.get('/api/f1/drivers/:year', async (c) => {
	console.log("hi")
    const year = c.req.param('year'); // Get the year from the request parameters

    // First, fetch the meeting information for the given year
    const meetingResponse = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`);
    const meetings = await meetingResponse.json();

    // Assuming meetings[0].meeting_key contains the meeting_key you need for drivers
	console.log()
    const meeting_key = meetings[0].meeting_key; // Adjust this based on your API response

    // Now fetch the drivers based on the retrieved meeting key
	console.log()
    const driversResponse = await fetch(`https://api.openf1.org/v1/drivers?meeting_key=${meeting_key}`);
    const drivers = await driversResponse.json();

    // Extract unique driver names
    let driverNames = [];
	let driverLists = [];
    for (const each of drivers) {
        if (!driverNames.includes(each.full_name)) {
            driverNames.push(each.full_name)
			driverLists.push(each);
        }
    }

    return c.json(driverLists); // Return JSON response with driver names
});


export default app



