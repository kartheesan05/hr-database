"use strict";exports.id=408,exports.ids=[408],exports.modules={49633:(e,r,a)=>{a.r(r),a.d(r,{"0012bdffda64799d1c0945e69e391e314584a977b9":()=>U,"0071a9881904b748dad6ef47205299f5101ef6b864":()=>y,"40113a22c9abfa18462da6ea22863b5865ab924892":()=>S,"402332dbb6680cfc8c0a3c005eee91efe83b8775a5":()=>A,"407f85da9070073ca29b5e7acc48879076c21c1451":()=>C,"40d3fa1c7a4129305c48a118f0a2b27692195e08bf":()=>$,"40deb9e34a70ef8ad21dd9763534db45b4697fbc37":()=>I,"40e915af307afa12a0ccd6fce4c05a49e787f6449d":()=>T,"6095d00c3b01391e72bf2f11d5eb2c52c54da29d76":()=>O,"60dbfb1c93aeb0412111f4028e4116ed95ce6fe540":()=>H,"700fd1620861f83a9bc858d7b806476cdfb8b02d91":()=>R});var n=a(21590);a(70376);let t=new(a(42449)).Pool({connectionString:process.env.DATABASE_URL});var i=a(16500);let o=i.z.object({email:i.z.string().email({message:"Please enter a valid email."}).trim(),password:i.z.string().min(8,{message:"Password must be 8 chars minimum"}).trim()}),s=o.extend({name:i.z.string().min(1,"Name is required"),role:i.z.enum(["admin","volunteer","incharge"],{required_error:"Role is required",invalid_type_error:"Invalid role"})}),l=i.z.object({hr_name:i.z.string().min(1,"HR name is required"),volunteer:i.z.string().min(1,"Volunteer name is required"),incharge:i.z.string().min(1,"Incharge name is required"),company:i.z.string().min(1,"Company name is required"),phone_number:i.z.string().regex(/^\d{10}$/,"Phone number must be exactly 10 digits"),status:i.z.enum(["Pending","Active","Inactive","Email_Sent","Not_Called","Blacklisted"],{required_error:"Status is required"}),email:i.z.string().email().optional().or(i.z.literal("")),interview_mode:i.z.enum(["Online","In-person","Both","Not Confirmed"],{required_error:"Interview mode is required",invalid_type_error:"Invalid interview mode"}).optional(),hr_count:i.z.number().int().min(1).default(1),transport:i.z.string().optional().or(i.z.literal("")),address:i.z.string().optional().or(i.z.literal("")),internship:i.z.enum(["Yes","No"]).default("No"),comments:i.z.string().optional().or(i.z.literal(""))});var c=a(99184);async function u(e){try{return(await t.query("SELECT * FROM users WHERE email = $1 LIMIT 1",[e])).rows[0]||null}catch(e){throw e}}var d=a(8805),m=a.n(d),h=a(41231),f=a(13194),E=a(42385);let g=process.env.SESSION_SECRET,_=new TextEncoder().encode(g);async function p(e){return new h.P(e).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(_)}async function v(e){try{let{payload:r}=await (0,f.V)(e,_,{algorithms:["HS256"]});return r}catch(e){}}async function w({email:e,role:r,incharge_email:a}){let n=new Date(Date.now()+6048e5),t={email:e,role:r,expiresAt:n};a&&(t.incharge_email=a);let i=await p(t);(await (0,E.UL)()).set("session",i,{expires:n,sameSite:"lax",path:"/"})}async function N(){await (0,E.UL)().delete("session")}async function b(){let e=(await E.UL()).get("session")?.value;return e&&await v(e)||null}async function $(e){let r=o.safeParse({email:e.get("email"),password:e.get("password")});if(!r.success)return console.log(r.error.flatten().fieldErrors),{errors:r.error.flatten().fieldErrors};let{email:a,password:n}=r.data,t=null,i=null,s=null;try{let e=await u(a);if(!e||!await m().compare(n,e.password))return{errors:"invaliduser"};if("volunteer"===e.role){let r=await u(e.incharge_email);s=r.name,incharge_email=r.email,await w({email:e.email,role:e.role,incharge_email:r.email})}else await w({email:e.email,role:e.role});t=e.role,i=e.name}catch(e){return{errors:"servererror"}}return{role:t,name:i,incharge:s}}async function y(){N(),(0,c.redirect)("/auth/login")}async function R(e=1,r=100,a={}){let n=await b();if(!n?.email)return{errors:"Unauthorized"};let i="SELECT * FROM hr_contacts",o=[],s=[];if("volunteer"===n.role)s.push("volunteer_email = $"+(o.length+1)),o.push(n.email);else if("incharge"===n.role)s.push("incharge_email = $"+(o.length+1)),o.push(n.email);else if("admin"!==n.role&&"global"!==n.role)return{errors:"Unauthorized"};a.name&&(s.push("hr_name ILIKE $"+(o.length+1)),o.push(`%${a.name}%`)),a.phoneNumber&&(s.push("phone_number ILIKE $"+(o.length+1)),o.push(`%${a.phoneNumber}%`)),a.search&&(s.push(`(
    hr_name ILIKE $${o.length+1} OR
    phone_number ILIKE $${o.length+1} OR
    email ILIKE $${o.length+1} OR
    company ILIKE $${o.length+1} OR
    volunteer ILIKE $${o.length+1} OR
    incharge ILIKE $${o.length+1} OR
    status ILIKE $${o.length+1} OR
    interview_mode ILIKE $${o.length+1} OR
    transport ILIKE $${o.length+1}
  )`),o.push(`%${a.search}%`)),a.interview&&(s.push("LOWER(interview_mode) = LOWER($"+(o.length+1)+")"),o.push(a.interview.toLowerCase())),a.status&&(s.push("status = $"+(o.length+1)),o.push(a.status)),s.length>0&&(i+=" WHERE "+s.join(" AND "));let l="SELECT COUNT(*) FROM hr_contacts"+(s.length>0?" WHERE "+s.join(" AND "):"");i+=` ORDER BY id LIMIT $${o.length+1} OFFSET $${o.length+2}`,o.push(r,(e-1)*r);try{let e=await t.query(i,o),r=await t.query(l,o.slice(0,-2)),a=parseInt(r.rows[0].count);return{data:e.rows,totalCount:a}}catch(e){throw e}}async function T(e){let r=await b();if(!r?.email)return{errors:"Unauthorized"};let a=l.safeParse({hr_name:e.hr_name,phone_number:e.phone_number,email:e.email,interview_mode:e.interview_mode,company:e.company,volunteer:e.volunteer,incharge:e.incharge,status:e.status,hr_count:e.hr_count?parseInt(e.hr_count):1,transport:e.transport,address:e.address,internship:e.internship||"No",comments:e.comments});if(!a.success)return{errors:a.error.flatten().fieldErrors};if("incharge"===r.role&&(!e.volunteer_email||!e.volunteer_email.includes("@")))return console.log("volunteer_email",e.volunteer_email),{errors:"A valid volunteer email is required"};if("admin"===r.role&&(!e.incharge_email||!e.volunteer_email||!e.incharge_email.includes("@")||!e.volunteer_email.includes("@")))return{errors:"Both incharge and volunteer emails are required and must be valid"};let n=a.data,i=`
    INSERT INTO hr_contacts (
      hr_name, phone_number, email, interview_mode, company,
      volunteer, incharge, status, hr_count, transport,
      address, internship, comments, incharge_email, volunteer_email
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `,o=[n.hr_name,n.phone_number,n.email,n.interview_mode,n.company,n.volunteer,n.incharge,n.status,n.hr_count,n.transport,n.address,n.internship,n.comments,"volunteer"===r.role?r.incharge_email:e.incharge_email,"volunteer"===r.role?r.email:e.volunteer_email];try{return(await t.query(i,o)).rows[0]}catch(e){if(console.error("Error adding HR record:",e),"23505"===e.code&&"unique_phone_number"===e.constraint)return{errors:"Phone number already exists in the database. Duplicate entries are not allowed."};return{errors:"Failed to add HR record"}}}async function O(e,r){let a=await b();if(!a?.email||"admin"!==a.role)return{errors:"Unauthorized"};let n=s.safeParse({email:r.email,password:r.password,role:r.role,name:r.name});if(!n.success)return{errors:n.error.flatten().fieldErrors};let i=r.inchargeEmail,{email:o,password:l,role:c,name:u}=n.data;if("volunteer"===c&&(console.log("inchargeEmail",i),0===(await t.query("SELECT * FROM users WHERE email = $1 AND role = $2",[i,"incharge"])).rows.length))return{errors:"Specified incharge email does not exist or is not an incharge"};let d=`
    INSERT INTO users (email, password, role, incharge_email, name) 
    VALUES ($1, $2, $3, $4, $5)
  `;try{let e=await m().hash(l,10);return await t.query(d,[o,e,c,"volunteer"===c?i:null,u]),{success:!0}}catch(e){return console.error("Error adding user:",e),{errors:"Server Error"}}}async function C(e){let r=await b();if(!r?.email)return{errors:"Unauthorized"};let a=`
    SELECT * FROM hr_contacts WHERE id = $1
  `,n=`
    SELECT email FROM users WHERE role = 'incharge'
  `;try{let[i,o]=await Promise.all([t.query(a,[e]),t.query(n)]);if(0===i.rows.length)return console.log("hr not found"),{errors:"HR record not found"};let s=i.rows[0];if("volunteer"===r.role&&s.volunteer_email!==r.email)return{errors:"Unauthorized - You can only view your own records"};if("incharge"===r.role&&s.incharge_email!==r.email)return{errors:"Unauthorized - You can only view records assigned to you"};if("volunteer"===r.role){let{volunteer_email:e,incharge_email:r,...a}=s;return{data:a,incharges:[]}}return{data:s,incharges:o.rows.map(e=>e.email)}}catch(e){return console.error("Error fetching HR record:",e),{errors:"Server Error"}}}async function H(e,r){let a=await b();if(!a?.email)return{errors:"Unauthorized"};let n=l.safeParse({hr_name:r.hr_name,phone_number:r.phone_number,email:r.email,interview_mode:r.interview_mode,company:r.company,volunteer:r.volunteer,incharge:r.incharge,status:r.status,hr_count:r.hr_count?parseInt(r.hr_count):1,transport:r.transport,address:r.address,internship:r.internship||"No",comments:r.comments});if(!n.success)return{errors:n.error.flatten().fieldErrors};let i=n.data,o=`
    SELECT * FROM hr_contacts WHERE id = $1
  `;try{let n=await t.query(o,[e]);if(0===n.rows.length)return{errors:"HR record not found"};let s=n.rows[0];if("volunteer"===a.role&&s.volunteer_email!==a.email)return{errors:"Unauthorized - You can only edit your own records"};if("incharge"===a.role&&s.incharge_email!==a.email)return{errors:"Unauthorized - You can only edit records assigned to you"};let l=`
  UPDATE hr_contacts SET
    hr_name = $1,
    phone_number = $2,
    email = $3,
    interview_mode = $4,
    company = $5,
    volunteer = $6,
    incharge = $7,
    status = $8,
    hr_count = $9,
    transport = $10,
    address = $11,
    internship = $12,
    comments = $13,
    volunteer_email = $14,
    incharge_email = $15
  WHERE id = $16
  RETURNING *
`,c=[i.hr_name,i.phone_number,i.email,i.interview_mode,i.company,i.volunteer,i.incharge,i.status,i.hr_count,i.transport,i.address,i.internship,i.comments,r.volunteer_email,r.incharge_email,e],u=await t.query(l,c);if(0===u.rows.length)return{errors:"HR record not found"};return{data:u.rows[0]}}catch(e){if(console.error("Error updating HR record:",e),"23505"===e.code&&"unique_phone_number"===e.constraint)return{errors:"Phone number already exists in the database. Duplicate entries are not allowed."};return{errors:"Failed to update HR record"}}}async function I(e){let r=await b();if(!r?.email)return{errors:"Unauthorized"};let a=`
    SELECT * FROM hr_contacts WHERE id = $1
  `;try{let n=await t.query(a,[e]);if(0===n.rows.length)return{errors:"HR record not found"};let i=n.rows[0];if("volunteer"===r.role&&i.volunteer_email!==r.email)return{errors:"Unauthorized - You can only delete your own records"};if("incharge"===r.role&&i.incharge_email!==r.email)return{errors:"Unauthorized - You can only delete records assigned to you"};let o=`
      DELETE FROM hr_contacts WHERE id = $1
    `;return await t.query(o,[e]),{success:!0}}catch(e){return console.error("Error deleting HR record:",e),{errors:"Failed to delete HR record"}}}async function S(e){let r=await b();if(!r?.email||"incharge"!==r.role&&"admin"!==r.role)return{errors:"Unauthorized"};let a=`
    SELECT 
      u.name,
      COUNT(CASE WHEN h.status = 'Email_Sent' THEN 1 END) as "Email Sent",
      COUNT(CASE WHEN h.status = 'Not_Called' THEN 1 END) as "Not Called",
      COUNT(CASE WHEN h.status = 'Active' THEN 1 END) as "Accepted",
      COUNT(CASE WHEN h.status = 'Pending' THEN 1 END) as "Pending",
      COUNT(CASE WHEN h.status = 'Inactive' THEN 1 END) as "Declined",
      COUNT(CASE WHEN h.status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(*) as contacts
    FROM users u
    LEFT JOIN hr_contacts h ON u.email = h.volunteer_email
    WHERE u.role = 'volunteer' 
    AND u.incharge_email = $1
    GROUP BY u.name
    ORDER BY u.name
  `;try{return{data:(await t.query(a,["incharge"===r.role?r.email:e])).rows}}catch(e){return console.error("Error fetching member stats:",e),{errors:"Failed to fetch member statistics"}}}async function U(){let e=await b();if(!e?.email||"admin"!==e.role)return{errors:"Unauthorized"};let r=`
    SELECT 
      u.name,
      COUNT(CASE WHEN h.status = 'Email_Sent' THEN 1 END) as "Email Sent",
      COUNT(CASE WHEN h.status = 'Not_Called' THEN 1 END) as "Not Called",
      COUNT(CASE WHEN h.status = 'Active' THEN 1 END) as "Accepted",
      COUNT(CASE WHEN h.status = 'Pending' THEN 1 END) as "Pending",
      COUNT(CASE WHEN h.status = 'Inactive' THEN 1 END) as "Declined",
      COUNT(CASE WHEN h.status = 'Blacklisted' THEN 1 END) as "Blacklisted",
      COUNT(*) as contacts
    FROM users u
    LEFT JOIN hr_contacts h ON u.email = h.incharge_email
    WHERE u.role = 'incharge'
    GROUP BY u.name
    ORDER BY u.name
  `;try{return{data:(await t.query(r,[])).rows}}catch(e){return console.error("Error fetching incharge stats:",e),{errors:"Failed to fetch incharge statistics"}}}async function A(e){let r=await b();if(!r?.email)return{errors:"Unauthorized"};let a=[],n=[];for(let t=0;t<e.length;t++){let i=e[t],o=l.safeParse({hr_name:i.hr_name,phone_number:i.phone_number,email:i.email,interview_mode:i.interview_mode,company:i.company,volunteer:i.volunteer,incharge:i.incharge,status:i.status,hr_count:i.hr_count?parseInt(i.hr_count):1,transport:i.transport,address:i.address,internship:i.internship||"No",comments:i.comments});if(!o.success){n.push({index:t,record:i,errors:o.error.flatten().fieldErrors});continue}if("incharge"===r.role&&(!i.volunteer_email||!i.volunteer_email.includes("@"))){n.push({index:t,record:i,errors:"A valid volunteer email is required"});continue}if("admin"===r.role&&(!i.incharge_email||!i.volunteer_email||!i.incharge_email.includes("@")||!i.volunteer_email.includes("@"))){n.push({index:t,record:i,errors:"Both incharge and volunteer emails are required and must be valid"});continue}a.push({...o.data,incharge_email:"volunteer"===r.role?r.incharge_email:i.incharge_email,volunteer_email:"volunteer"===r.role?r.email:i.volunteer_email})}if(n.length===e.length)return{errors:n};let i={success:[],duplicates:[],errors:n};for(let e of a){let r=`
      INSERT INTO hr_contacts (
        hr_name, phone_number, email, interview_mode, company,
        volunteer, incharge, status, hr_count, transport,
        address, internship, comments, incharge_email, volunteer_email
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT ON CONSTRAINT unique_phone_number DO NOTHING
      RETURNING *;
    `,a=[e.hr_name,e.phone_number,e.email,e.interview_mode,e.company,e.volunteer,e.incharge,e.status,e.hr_count,e.transport,e.address,e.internship,e.comments,e.incharge_email,e.volunteer_email];try{let n=await t.query(r,a);0===n.rows.length?i.duplicates.push({phone_number:e.phone_number,hr_name:e.hr_name}):i.success.push(n.rows[0])}catch(r){console.error("Error adding HR record:",r),i.errors.push({record:e,error:"Database error while inserting record"})}}return{success:!0,message:`Successfully inserted ${i.success.length} records`,results:{successful:i.success.length,duplicates:i.duplicates,errors:i.errors}}}(0,a(99344).D)([$,y,R,T,O,C,H,I,S,U,A]),(0,n.A)($,"40d3fa1c7a4129305c48a118f0a2b27692195e08bf",null),(0,n.A)(y,"0071a9881904b748dad6ef47205299f5101ef6b864",null),(0,n.A)(R,"700fd1620861f83a9bc858d7b806476cdfb8b02d91",null),(0,n.A)(T,"40e915af307afa12a0ccd6fce4c05a49e787f6449d",null),(0,n.A)(O,"6095d00c3b01391e72bf2f11d5eb2c52c54da29d76",null),(0,n.A)(C,"407f85da9070073ca29b5e7acc48879076c21c1451",null),(0,n.A)(H,"60dbfb1c93aeb0412111f4028e4116ed95ce6fe540",null),(0,n.A)(I,"40deb9e34a70ef8ad21dd9763534db45b4697fbc37",null),(0,n.A)(S,"40113a22c9abfa18462da6ea22863b5865ab924892",null),(0,n.A)(U,"0012bdffda64799d1c0945e69e391e314584a977b9",null),(0,n.A)(A,"402332dbb6680cfc8c0a3c005eee91efe83b8775a5",null)},69576:(e,r,a)=>{a.d(r,{BT:()=>c,Wu:()=>u,ZB:()=>l,Zp:()=>o,aR:()=>s,wL:()=>d});var n=a(45512),t=a(58009),i=a(86645);let o=t.forwardRef(({className:e,...r},a)=>(0,n.jsx)("div",{ref:a,className:(0,i.cn)("rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50",e),...r}));o.displayName="Card";let s=t.forwardRef(({className:e,...r},a)=>(0,n.jsx)("div",{ref:a,className:(0,i.cn)("flex flex-col space-y-1.5 p-6",e),...r}));s.displayName="CardHeader";let l=t.forwardRef(({className:e,...r},a)=>(0,n.jsx)("h3",{ref:a,className:(0,i.cn)("font-semibold leading-none tracking-tight",e),...r}));l.displayName="CardTitle";let c=t.forwardRef(({className:e,...r},a)=>(0,n.jsx)("p",{ref:a,className:(0,i.cn)("text-sm text-neutral-500 dark:text-neutral-400",e),...r}));c.displayName="CardDescription";let u=t.forwardRef(({className:e,...r},a)=>(0,n.jsx)("div",{ref:a,className:(0,i.cn)("p-6 pt-0",e),...r}));u.displayName="CardContent";let d=t.forwardRef(({className:e,...r},a)=>(0,n.jsx)("div",{ref:a,className:(0,i.cn)("flex items-center p-6 pt-0",e),...r}));d.displayName="CardFooter"}};