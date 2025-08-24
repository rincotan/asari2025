
// localStorage 初期化
if(!localStorage.getItem("solvedQuiz")) localStorage.setItem("solvedQuiz","{}");
if(!localStorage.getItem("unlockedStep")) localStorage.setItem("unlockedStep",JSON.stringify([1]));

const solvedQuiz = JSON.parse(localStorage.getItem("solvedQuiz"));
const unlockedStep = JSON.parse(localStorage.getItem("unlockedStep"));

window.addEventListener("DOMContentLoaded", ()=>{
  const params = new URLSearchParams(window.location.search);
  const stepNum = parseInt(params.get("step")) || 1;

  const stepTitle = document.getElementById("step-title");
  stepTitle.innerText = `STEP${stepNum}`;

  // ハンバーガー開閉
  document.getElementById("hamburger").addEventListener("click", ()=>{
    document.getElementById("menu").classList.toggle("open");
  });

  // 戻る・進むメニュー
  document.querySelectorAll(".menu a").forEach(a=>{
    a.addEventListener("click", e=>{
      e.preventDefault();
      const targetStep = parseInt(a.dataset.step);
      if(targetStep <= stepNum){
        // 戻る場合は常にOK
        window.location.href = targetStep===0?"index.html":`step.html?step=${targetStep}`;
      } else {
        const unlockedStep = JSON.parse(localStorage.getItem("unlockedStep")||"[1]");
        if(unlockedStep.includes(targetStep)) window.location.href=`step.html?step=${targetStep}`;
        else alert("まだこのSTEPは解放されていません！");
      }
    });
  });

  // STEPごとの答え
  const stepAnswers = {1:"ひろとん", 2:"あさり", 3:"えにぐま"};

  // STEP入力判定
  document.getElementById("step-submit").addEventListener("click", ()=>{
    const val = document.getElementById("step-input").value.trim();
    if(val === stepAnswers[stepNum]){
      alert("正解！次のSTEPが解放されました。");

      // アンロック処理
      const unlockedStep = JSON.parse(localStorage.getItem("unlockedStep")||"[1]");
      if(!unlockedStep.includes(stepNum+1)) unlockedStep.push(stepNum+1);
      localStorage.setItem("unlockedStep", JSON.stringify(unlockedStep));

      // 次のSTEPへ
      if(stepNum<3) window.location.href=`step.html?step=${stepNum+1}`;
      else alert("最後のSTEPです！");
    } else {
      alert("違います！");
    }
  });
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

