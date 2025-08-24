// ハンバーガー
document.getElementById("hamburger")?.addEventListener("click", ()=>{
  document.getElementById("menu").classList.toggle("open");
});

// localStorage 初期化
if(!localStorage.getItem("solvedQuiz")) localStorage.setItem("solvedQuiz","{}");
if(!localStorage.getItem("unlockedStep")) localStorage.setItem("unlockedStep",JSON.stringify([1]));

const solvedQuiz = JSON.parse(localStorage.getItem("solvedQuiz"));
const unlockedStep = JSON.parse(localStorage.getItem("unlockedStep"));

// ハンバーガーメニュークリック
document.querySelectorAll(".menu a").forEach(a=>{
  a.onclick = e=>{
    e.preventDefault();
    const step = parseInt(a.dataset.step);
    if(step===0) window.location.href="index.html";
    else window.location.href=`step.html?step=${step}`;
  }
});

// 戻る系共通
function goToStep(step){
  if(step===0) window.location.href="index.html";
  else window.location.href=`step.html?step=${step}`;
}

// STEPページの問題ボタン生成
function generateStepButtons(stepNum,total){
  const grid = document.getElementById("problem-grid");
  if(!grid) return;
  grid.innerHTML="";
  for(let i=1;i<=total;i++){
    const btn=document.createElement("button");
    btn.innerText=i;
    btn.onclick = ()=> window.location.href=`quiz.html?step=${stepNum}&quiz=${i}`;
    if(solvedQuiz[`s${stepNum}q${i}`]) btn.style.background="lightgreen";
    grid.appendChild(btn);
  }
}

// 小問題の正解判定
function checkQuizAnswer(stepNum, quizNum, correct){
  const input = document.getElementById("quiz-answer").value.trim();
  if(input===correct){
    alert("正解！");
    solvedQuiz[`s${stepNum}q${quizNum}`]=true;
    localStorage.setItem("solvedQuiz", JSON.stringify(solvedQuiz));
    window.location.href=`step.html?step=${stepNum}`;
  } else alert("不正解！");
}
