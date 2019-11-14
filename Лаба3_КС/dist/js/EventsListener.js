document.getElementById('N').addEventListener('change',(e)=>{
    OptionsForm.N = Number(e.target.value);
    // console.log(OptionsForm);
});
document.getElementById('set_task').addEventListener('change',(e)=>{
    OptionsForm.task = e.target.value;
    // console.log(OptionsForm);
});
document.getElementById('set_options').addEventListener('change',(e)=>{
    OptionsForm.typeBorder = e.target.value;
    // console.log(OptionsForm);
});
document.getElementById('start').addEventListener('click',()=>{
    Go();
});