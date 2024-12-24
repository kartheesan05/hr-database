(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[183],{745:(e,r,n)=>{Promise.resolve().then(n.bind(n,82350)),Promise.resolve().then(n.bind(n,86195))},82350:(e,r,n)=>{"use strict";n.d(r,{default:()=>v});var a=n(95155),l=n(12115),s=n(59539),i=n(47370),t=n(60728),d=n(96894),o=n(91072),u=n(84328),c=n(80728),m=n(98930),h=n(75828);let b=(0,h.createServerReference)("40e915af307afa12a0ccd6fce4c05a49e787f6449d",h.callServer,void 0,h.findSourceMapURL,"addHrRecord");var g=n(60234);function v(){let[e,r]=(0,l.useState)({hr_name:"",volunteer:"",volunteer_email:"",incharge:"",incharge_email:"",company:"",email:"",phone_number:"",status:"Not_Called",interview_mode:"Not Confirmed",hr_count:1,transport:"",address:"",internship:"No",comments:""}),[n,h]=(0,l.useState)(!1),[v,x]=(0,l.useState)(!1),p=(0,s.rd)(),[f,j]=(0,l.useState)(null),[_,N]=(0,l.useTransition)(),y=e=>{let{name:n,value:a}=e.target;r(e=>({...e,[n]:a}))},w=(e,n)=>{r(r=>({...r,[e]:n}))},C=async n=>{n.preventDefault(),h(!0),x(!1),j(null);let a=g.CR.safeParse({hr_name:e.hr_name,phone_number:e.phone_number,email:e.email,interview_mode:e.interview_mode,company:e.company,volunteer:e.volunteer,incharge:e.incharge,status:e.status,hr_count:e.hr_count,transport:e.transport,address:e.address,internship:e.internship,comments:e.comments});if(!a.success){j(a.error.flatten().fieldErrors),h(!1);return}try{console.log(a.data),N(async()=>{let r=await b({...a.data,volunteer_email:e.volunteer_email,incharge_email:e.incharge_email});if(r.errors){j(r.errors),h(!1);return}x(!0)}),r({hr_name:"",volunteer:"",incharge:"",company:"",email:"",phone_number:"",status:"Not_Called",interview_mode:"Not Confirmed",hr_count:1,transport:"",address:"",internship:"No",comments:"",volunteer_email:"",incharge_email:""})}catch(e){j("An error occurred while adding the HR record. Please try again.")}finally{h(!1)}},[k,z]=(0,l.useState)(null);return(0,l.useEffect)(()=>{"volunteer"===localStorage.getItem("role")&&r(e=>({...e,incharge:localStorage.getItem("incharge"),volunteer:localStorage.getItem("name")})),z(localStorage.getItem("role"))},[]),(0,a.jsxs)("div",{className:"min-h-screen w-screen p-[75px] bg-blue-50 relative",children:[(0,a.jsxs)(t.Zp,{className:"mb-6 border-blue-200 shadow-blue-100 rounded-lg",children:[(0,a.jsx)(t.aR,{className:"bg-blue-100 rounded-t-lg mb-4",children:(0,a.jsx)(t.ZB,{className:"text-blue-800 text-center text-3xl font-bold",children:"Add New HR Record"})}),(0,a.jsx)(t.Wu,{className:"bg-white rounded-lg",children:(0,a.jsxs)("form",{onSubmit:C,className:"space-y-4",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"hr_name",children:"HR Name"}),(0,a.jsx)(d.p,{id:"hr_name",name:"hr_name",value:e.hr_name,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"phone_number",children:"Phone Number"}),(0,a.jsx)(d.p,{id:"phone_number",name:"phone_number",value:e.phone_number,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"email",children:"Email"}),(0,a.jsx)(d.p,{id:"email",name:"email",type:"email",value:e.email,onChange:y,className:"border-blue-200 focus:ring-blue-500"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{children:"Interview Mode"}),(0,a.jsxs)(m.l6,{value:e.interview_mode,onValueChange:e=>w("interview_mode",e),children:[(0,a.jsx)(m.bq,{className:"border-blue-200 focus:ring-blue-500",children:(0,a.jsx)(m.yv,{placeholder:"Interview Mode"})}),(0,a.jsxs)(m.gC,{children:[(0,a.jsx)(m.eb,{value:"Not Confirmed",children:"Not Confirmed"}),(0,a.jsx)(m.eb,{value:"Online",children:"Online"}),(0,a.jsx)(m.eb,{value:"In-person",children:"In-person"}),(0,a.jsx)(m.eb,{value:"Both",children:"Both"})]})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"company",children:"Company"}),(0,a.jsx)(d.p,{id:"company",name:"company",value:e.company,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"volunteer",children:"Member"}),(0,a.jsx)(d.p,{id:"volunteer",name:"volunteer",value:e.volunteer,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),("incharge"===k||"admin"===k)&&(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"volunteer_email",children:"Member Email"}),(0,a.jsx)(d.p,{id:"volunteer_email",name:"volunteer_email",type:"email",value:e.volunteer_email,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"incharge",children:"Incharge"}),(0,a.jsx)(d.p,{id:"incharge",name:"incharge",value:e.incharge,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),"admin"===k&&(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"incharge_email",children:"Incharge Email"}),(0,a.jsx)(d.p,{id:"incharge_email",name:"incharge_email",type:"email",value:e.incharge_email,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"status",children:"Status"}),(0,a.jsxs)(m.l6,{value:e.status,onValueChange:e=>w("status",e),children:[(0,a.jsx)(m.bq,{className:"border-blue-200 focus:ring-blue-500",children:(0,a.jsx)(m.yv,{placeholder:"Select status"})}),(0,a.jsxs)(m.gC,{children:[(0,a.jsx)(m.eb,{value:"Pending",children:"Pending"}),(0,a.jsx)(m.eb,{value:"Active",children:"Accepted"}),(0,a.jsx)(m.eb,{value:"Inactive",children:"Declined"}),(0,a.jsx)(m.eb,{value:"Email_Sent",children:"Email Sent"}),(0,a.jsx)(m.eb,{value:"Not_Called",children:"Not Called"}),(0,a.jsx)(m.eb,{value:"Blacklisted",children:"Blacklisted"})]})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"hr_count",children:"HR Count"}),(0,a.jsx)(d.p,{id:"hr_count",name:"hr_count",type:"number",min:"1",value:e.hr_count,onChange:y,className:"border-blue-200 focus:ring-blue-500",required:!0})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"transport",children:"Transport"}),(0,a.jsx)(d.p,{id:"transport",name:"transport",value:e.transport,onChange:y,className:"border-blue-200 focus:ring-blue-500"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"address",children:"Address"}),(0,a.jsx)(d.p,{id:"address",name:"address",value:e.address,onChange:y,className:"border-blue-200 focus:ring-blue-500"})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(o.J,{htmlFor:"internship",children:"Internship"}),(0,a.jsxs)(m.l6,{value:e.internship,onValueChange:e=>w("internship",e),children:[(0,a.jsx)(m.bq,{className:"border-blue-200 focus:ring-blue-500",children:(0,a.jsx)(m.yv,{placeholder:"Select internship"})}),(0,a.jsxs)(m.gC,{children:[(0,a.jsx)(m.eb,{value:"Yes",children:"Yes"}),(0,a.jsx)(m.eb,{value:"No",children:"No"})]})]})]})]}),(0,a.jsxs)("div",{className:"mt-4",children:[(0,a.jsx)(o.J,{htmlFor:"comments",children:"Comments"}),(0,a.jsx)(u.T,{id:"comments",name:"comments",value:e.comments,onChange:y,className:"border-blue-200 focus:ring-blue-500 min-h-[100px]"})]}),(0,a.jsx)(i.$,{type:"submit",className:"w-full bg-blue-800 hover:bg-blue-900",disabled:n||_,children:n||_?"Adding...":"Add HR Record"})]})})]}),f&&(0,a.jsxs)(c.Fc,{variant:"destructive",className:"mb-6 bg-red-100 border-red-400 text-red-700",children:[(0,a.jsx)(c.XL,{children:"Error"}),(0,a.jsx)(c.TN,{children:"string"==typeof f?f:Object.values(f).flat().join(", ")})]}),v&&(0,a.jsxs)(c.Fc,{className:"mb-6 bg-green-100 border-green-400 text-green-700",children:[(0,a.jsx)(c.XL,{children:"Success"}),(0,a.jsx)(c.TN,{children:"HR record has been successfully added."})]}),(0,a.jsx)(i.$,{onClick:()=>p.push("/"),className:"mt-4 bg-white hover:bg-blue-100 text-blue-800 border border-neutral-200 dark:border-neutral-800",children:"Back to HR Database"})]})}},80728:(e,r,n)=>{"use strict";n.d(r,{Fc:()=>d,TN:()=>u,XL:()=>o});var a=n(95155),l=n(12115),s=n(40652),i=n(77849);let t=(0,s.F)("relative w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-neutral-950 [&>svg~*]:pl-7 dark:border-neutral-800 dark:[&>svg]:text-neutral-50",{variants:{variant:{default:"bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50",destructive:"border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900"}},defaultVariants:{variant:"default"}}),d=l.forwardRef((e,r)=>{let{className:n,variant:l,...s}=e;return(0,a.jsx)("div",{ref:r,role:"alert",className:(0,i.cn)(t({variant:l}),n),...s})});d.displayName="Alert";let o=l.forwardRef((e,r)=>{let{className:n,...l}=e;return(0,a.jsx)("h5",{ref:r,className:(0,i.cn)("mb-1 font-medium leading-none tracking-tight",n),...l})});o.displayName="AlertTitle";let u=l.forwardRef((e,r)=>{let{className:n,...l}=e;return(0,a.jsx)("div",{ref:r,className:(0,i.cn)("text-sm [&_p]:leading-relaxed",n),...l})});u.displayName="AlertDescription"},96894:(e,r,n)=>{"use strict";n.d(r,{p:()=>i});var a=n(95155),l=n(12115),s=n(77849);let i=l.forwardRef((e,r)=>{let{className:n,type:l,...i}=e;return(0,a.jsx)("input",{type:l,className:(0,s.cn)("flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",n),ref:r,...i})});i.displayName="Input"},91072:(e,r,n)=>{"use strict";n.d(r,{J:()=>o});var a=n(95155),l=n(12115),s=n(24352),i=n(40652),t=n(77849);let d=(0,i.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),o=l.forwardRef((e,r)=>{let{className:n,...l}=e;return(0,a.jsx)(s.b,{ref:r,className:(0,t.cn)(d(),n),...l})});o.displayName=s.b.displayName},84328:(e,r,n)=>{"use strict";n.d(r,{T:()=>i});var a=n(95155),l=n(12115),s=n(77849);let i=l.forwardRef((e,r)=>{let{className:n,...l}=e;return(0,a.jsx)("textarea",{className:(0,s.cn)("flex min-h-[60px] w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",n),ref:r,...l})});i.displayName="Textarea"},60234:(e,r,n)=>{"use strict";n.d(r,{CR:()=>l});var a=n(43415);a.z.object({email:a.z.string().email({message:"Please enter a valid email."}).trim(),password:a.z.string().min(8,{message:"Password must be 8 chars minimum"}).trim()}).extend({name:a.z.string().min(1,"Name is required"),role:a.z.enum(["admin","volunteer","incharge"],{required_error:"Role is required",invalid_type_error:"Invalid role"})});let l=a.z.object({hr_name:a.z.string().min(1,"HR name is required"),volunteer:a.z.string().min(1,"Volunteer name is required"),incharge:a.z.string().min(1,"Incharge name is required"),company:a.z.string().min(1,"Company name is required"),phone_number:a.z.string().regex(/^\d{10}$/,"Phone number must be exactly 10 digits"),status:a.z.enum(["Pending","Active","Inactive","Email_Sent","Not_Called","Blacklisted"],{required_error:"Status is required"}),email:a.z.string().email().optional().or(a.z.literal("")),interview_mode:a.z.enum(["Online","In-person","Both","Not Confirmed"],{required_error:"Interview mode is required",invalid_type_error:"Invalid interview mode"}).optional(),hr_count:a.z.number().int().min(1).default(1),transport:a.z.string().optional().or(a.z.literal("")),address:a.z.string().optional().or(a.z.literal("")),internship:a.z.enum(["Yes","No"]).default("No"),comments:a.z.string().optional().or(a.z.literal(""))})}},e=>{var r=r=>e(e.s=r);e.O(0,[105,539,430,32,255,60,441,517,358],()=>r(745)),_N_E=e.O()}]);