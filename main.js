// pc判定＆警告
window.addEventListener("DOMContentLoaded", ()=>{
  const pcWarn = document.getElementById("pc-warning");
  if(window.innerWidth > 600 && pcWarn){
    pcWarn.style.display = "block";
    document.body.style.overflow = "hidden";
  }
});

// localStorage 初期化
if(!localStorage.getItem("solvedQuiz")) localStorage.setItem("solvedQuiz","{}");
if(!localStorage.getItem("unlockedStep")) localStorage.setItem("unlockedStep",JSON.stringify([1]));

const solvedQuiz = JSON.parse(localStorage.getItem("solvedQuiz"));
const unlockedStep = JSON.parse(localStorage.getItem("unlockedStep"));

window.addEventListener("DOMContentLoaded", ()=>{
  const params = new URLSearchParams(window.location.search);
  const stepNum = parseInt(params.get("step")) || 1;

  // bodyにstepクラスを付与
  document.body.classList.add(`step${stepNum}`);

  const stepTitle = document.getElementById("step-title");
  if(stepTitle) stepTitle.innerText = `STEP${stepNum}`;

  // ハンバーガー開閉
  document.getElementById("hamburger").addEventListener("click", ()=>{
    document.getElementById("menu").classList.toggle("open");
  });

  // メニューのロック状態反映
  document.querySelectorAll(".menu a").forEach(a=>{
    const targetStep = parseInt(a.dataset.step);
    if(targetStep > 0 && !unlockedStep.includes(targetStep)){
      a.classList.add("locked");   // CSSで灰色などに
    } else {
      a.classList.remove("locked");
    }
  });

  // 戻る・進むメニュー
  document.querySelectorAll(".menu a").forEach(a=>{
    a.addEventListener("click", e=>{
      e.preventDefault();
      const targetStep = parseInt(a.dataset.step);

      if(targetStep === 0){
        window.location.href="index.html";
      } else {
        const unlocked = JSON.parse(localStorage.getItem("unlockedStep")||"[1]");
        if(unlocked.includes(targetStep)){
          window.location.href=`step.html?step=${targetStep}`;
        } else {
          alert("まだこのSTEPは解放されていません！");
        }
      }
    });
  });

  // STEPごとの答え
  const stepAnswers = {1:"ひろとん", 2:"あさり", 3:"えにぐま"};

  // STEP入力判定
  const submitBtn = document.getElementById("step-submit");
  if(submitBtn){
    submitBtn.addEventListener("click", ()=>{
      const val = document.getElementById("step-input").value.trim();
      if(val === stepAnswers[stepNum]){
        alert("正解！次のSTEPが解放されました。");

        // アンロック処理
        const unlocked = JSON.parse(localStorage.getItem("unlockedStep")||"[1]");

        // 現在のSTEPを記録
        if(!unlocked.includes(stepNum)) unlocked.push(stepNum);

        // 次のSTEPも解放
        if(stepNum < 3 && !unlocked.includes(stepNum+1)){
          unlocked.push(stepNum+1);
        }

        localStorage.setItem("unlockedStep", JSON.stringify(unlocked));

        // 次のSTEPへ
        if(stepNum < 3) {
          window.location.href=`step.html?step=${stepNum+1}`;
        } else {
          alert("最後のSTEPです！");
        }
      } else {
        alert("違います！");
      }
    });
  }
  // ...既存のコード...
  const pcWarn = document.getElementById("pc-warning");
  if(window.innerWidth > 600 && pcWarn){
    pcWarn.style.display = "block";
    document.body.style.overflow = "hidden";
  }
});


// 戻る系共通
function goToStep(step){
  if(step===0) window.location.href="index.html";
  else window.location.href=`step.html?step=${step}`;
}

// STEPページの問題ボタン生成
function generateStepButtons(stepNum,total){
  console.log("出てこい１");
  const grid = document.getElementById("problem-grid");
  if(!grid) return;
  grid.innerHTML="";
  for(let i=1;i<=total;i++){
    console.log("出てこい");
    const btn=document.createElement("button");
    btn.innerText=i;
    btn.onclick = ()=> window.location.href=`quiz.html?step=${stepNum}&quiz=${i}`;
    if(solvedQuiz[`s${stepNum}q${i}`]) btn.style.background="lightgreen";
    grid.appendChild(btn);
  }
}

// 小問題の正解判定
function checkAnswer(inputId, correct) {
  const val = document.getElementById(inputId).value.trim();
  const result = document.getElementById(inputId + "-result");
  result.textContent = (val === correct) ? "正解！" : "不正解…";
}

function checkStepAnswer(stepNum, correct) {
  const val = document.getElementById(`step${stepNum}-answer`).value.trim();
  if (val === correct) {
    alert("正解！次のSTEPが解放されました");
    unlockStep(stepNum + 1);
  } else {
    alert("不正解…");
  }
}

//これ何
const params = new URLSearchParams(window.location.search);
const stepNum = parseInt(params.get("step"))||1;
const stepData = {1:5,2:6,3:6};


const stepTitleElem = document.getElementById("step-title");
if(stepTitleElem) stepTitleElem.innerText = `STEP${stepNum}`;
//document.getElementById("prev-btn").disabled = stepNum===1;
//document.getElementById("prev-btn").onclick=()=>goToStep(stepNum-1);

generateStepButtons(stepNum, stepData[stepNum]);


// アンロック済みSTEP更新
if(!unlockedStep.includes(stepNum)) {
  unlockedStep.push(stepNum);
  localStorage.setItem("unlockedStep", JSON.stringify(unlockedStep));
}