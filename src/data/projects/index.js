import lab from './braisgf-lab.js'
import content from './public-content.js'
import bell from './rpg-bell.js'
import drawing from './drawing.js'
import vault from './vault-42.js'
export const projects=[lab,content,bell,drawing,vault]
export const getProject=(id)=>projects.find(project=>project.id===id)
