const members = [
  {id:"GCRA-001", name:"Sample Member 1", location:"Cavite", status:"Active"},
  {id:"GCRA-002", name:"Sample Member 2", location:"Dasmariñas", status:"Active"},
  {id:"GCRA-003", name:"Sample Member 3", location:"General Trias", status:"Pending"}
];

let currentRole = "member";

const rows = document.getElementById("memberRows");
const search = document.getElementById("search");
const role = document.getElementById("role");
const roleBadge = document.getElementById("roleBadge");
const addBtn = document.getElementById("addBtn");
const empty = document.getElementById("empty");
const dialog = document.getElementById("memberDialog");
const form = document.getElementById("memberForm");

function canEdit(){ return currentRole === "admin" || currentRole === "owner"; }
function canDelete(){ return currentRole === "owner"; }

function render(){
  const q = search.value.toLowerCase().trim();
  const filtered = members.filter(m => [m.id,m.name,m.location,m.status].join(" ").toLowerCase().includes(q));
  rows.innerHTML = "";
  filtered.forEach((m) => {
    const i = members.indexOf(m);
    const tr = document.createElement("tr");
    let actions = '<span>View</span>';
    if(canEdit()) actions += ` <button class="action" onclick="editMember(${i})">Edit</button>`;
    if(canDelete()) actions += ` <button class="action danger" onclick="deleteMember(${i})">Delete</button>`;
    tr.innerHTML = `<td>${escapeHtml(m.id)}</td><td>${escapeHtml(m.name)}</td><td>${escapeHtml(m.location || "")}</td><td>${escapeHtml(m.status)}</td><td>${actions}</td>`;
    rows.appendChild(tr);
  });
  empty.classList.toggle("hidden", filtered.length !== 0);
  addBtn.classList.toggle("hidden", !canEdit());
  roleBadge.textContent = currentRole === "owner" ? "OWNER" : currentRole === "admin" ? "AUTHORIZED ADMIN" : "VIEW ONLY";
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }

role.addEventListener("change", e => { currentRole=e.target.value; render(); });
search.addEventListener("input", render);

addBtn.addEventListener("click", () => openForm(-1));

function openForm(index){
  document.getElementById("dialogTitle").textContent = index < 0 ? "Add Member" : "Edit Member";
  document.getElementById("memberIndex").value = index;
  const m = index < 0 ? {id:"",name:"",location:"",status:"Active"} : members[index];
  document.getElementById("memberId").value=m.id;
  document.getElementById("name").value=m.name;
  document.getElementById("location").value=m.location;
  document.getElementById("status").value=m.status;
  dialog.showModal();
}
window.editMember = i => { if(canEdit()) openForm(i); };
window.deleteMember = i => {
  if(!canDelete()) return;
  if(confirm("I-delete ang member na ito?")) { members.splice(i,1); render(); }
};

form.addEventListener("submit", e => {
  e.preventDefault();
  if(!canEdit()) return;
  const index = Number(document.getElementById("memberIndex").value);
  const item = {
    id:document.getElementById("memberId").value.trim(),
    name:document.getElementById("name").value.trim(),
    location:document.getElementById("location").value.trim(),
    status:document.getElementById("status").value
  };
  if(index < 0) members.push(item); else members[index]=item;
  dialog.close();
  render();
});

render();
