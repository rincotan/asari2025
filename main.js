// pc判定＆警告
window.addEventListener("DOMContentLoaded", () => {
  const pcWarn = document.getElementById("pc-warning");
  if (window.innerWidth > 600 && pcWarn) {
    pcWarn.style.display = "block";
    document.body.style.overflow = "hidden";
  }
});

// localStorage 初期化
if (!localStorage.getItem("solvedQuiz"))
  localStorage.setItem("solvedQuiz", "{}");
if (!localStorage.getItem("unlockedStep"))
  localStorage.setItem("unlockedStep", JSON.stringify([1]));

const solvedQuiz = JSON.parse(localStorage.getItem("solvedQuiz"));
const unlockedStep = JSON.parse(localStorage.getItem("unlockedStep"));

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const stepNum = parseInt(params.get("step")) || 0;

  // bodyにstepクラスを付与
  document.body.classList.add(`step${stepNum}`);

  const stepTitle = document.getElementById("step-title");
  if (stepTitle) stepTitle.innerText = `STEP${stepNum}`;

  document.querySelectorAll(".story-box").forEach((elem) => {
    if (stepNum === 1) {
      elem.innerHTML = "冊子と5枚の謎を組み合わせて<br>彼の名前を導こう";
    } else if (stepNum === 2) {
      elem.innerHTML =
        "宇宙船に書かれた6つの謎と冊子を使い<br>宇宙船の開け方を導け";
    } else if (stepNum === 3) {
      elem.innerHTML = "パスワードを忘れた方はこちらの謎をお解き";
    }
  });

  // ハンバーガー開閉
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("open");
  });

  // メニューのロック状態反映
  document.querySelectorAll(".menu a").forEach((a) => {
    const targetStep = parseInt(a.dataset.step);
    if (targetStep > 0 && !unlockedStep.includes(targetStep)) {
      a.classList.add("locked"); // CSSで灰色などに
    } else {
      a.classList.remove("locked");
    }
  });

  // 戻る・進むメニュー
  document.querySelectorAll(".menu a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();

      // data-step属性がある場合（STEPページへのリンク）
      if (a.dataset.step !== undefined) {
        const targetStep = parseInt(a.dataset.step);

        if (targetStep === 0) {
          window.location.href = "index.html";
        } else {
          const unlocked = JSON.parse(
            localStorage.getItem("unlockedStep") || "[1]"
          );
          if (unlocked.includes(targetStep)) {
            window.location.href = `step.html?step=${targetStep}`;
          } else {
            alert("まだこのSTEPは解放されていません！");
          }
        }
      } else {
        // href属性がある場合（直接リンク）
        const href = a.getAttribute("href");
        if (href && href !== "#") {
          window.location.href = href;
        }
      }
    });
  });

  // STEPごとの答え
  const stepAnswers = { 1: "たいたん", 2: "かぎ", 3: "こめっと06" };

  // STEP入力判定
  const submitBtn = document.getElementById("step-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const val = document.getElementById("step-input").value.trim();
      const isCorrect = val === stepAnswers[stepNum];
      // モーダルで結果表示（正解も不正解も）
      showStepResultModal(isCorrect, stepNum);
    });
  }

  const pcWarn = document.getElementById("pc-warning");
  if (window.innerWidth > 600 && pcWarn) {
    pcWarn.style.display = "block";
    document.body.style.overflow = "hidden";
  }
});

// STEPページの問題ボタン生成
function generateStepButtons(stepNum, total) {
  const grid = document.getElementById("problem-grid");
  if (!grid) return;
  grid.innerHTML = "";
  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.onclick = () =>
      (window.location.href = `quiz.html?step=${stepNum}&quiz=${i}`);
    if (solvedQuiz[`s${stepNum}q${i}`]) btn.style.background = "lightgreen";
    grid.appendChild(btn);
  }
}

// 小問題の正解判定
function checkQuizAnswer(inputId, correct) {
  const val = document.getElementById(inputId).value.trim();
  const result = document.getElementById(inputId + "-result");
  let isCorrect = val === correct;
  // モーダル表示
  showResultModal(isCorrect, val, correct);
}

function showResultModal(isCorrect, val, correct) {
  const modal = document.getElementById("result-modal");
  const content = document.getElementById("result-content");
  const closeBtn = document.getElementById("modal-close-btn");
  const nextBtn = document.getElementById("modal-next-btn");

  // 問題番号取得
  const params = new URLSearchParams(window.location.search);
  const stepNum = parseInt(params.get("step")) || 1;
  const quizNum = parseInt(params.get("quiz")) || 1;

  if (isCorrect) {
    const explanation = quizData[stepNum][quizNum].explanation;
    const explanationImg = quizData[stepNum][quizNum].explanation_img;

    // 正解を保存（STEPページの小問題ボタン色付け用）
    try {
      const solved = JSON.parse(localStorage.getItem("solvedQuiz") || "{}");
      solved[`s${stepNum}q${quizNum}`] = true;
      localStorage.setItem("solvedQuiz", JSON.stringify(solved));
    } catch (_) {}

    let explanationText = "";
    if (Array.isArray(explanation)) {
      explanationText = explanation.join("<br>");
    } else if (explanation) {
      explanationText = explanation;
    } else {
      explanationText = "解説は準備中です。";
    }

    let contentHTML = `
      <div style="color:#f08080;font-size:2em;font-weight:bold;">正解</div>
    `;

    // 解説画像がある場合は表示
    if (explanationImg) {
      contentHTML += `<img src="${explanationImg}" style="width:90%;max-width:300px;margin:10px auto;border:2px solid #ddd;border-radius:8px;">`;
    }

    contentHTML += `<div style="margin-top:10px;font-size:0.9em;line-height:1.4;text-align:left;padding:10px;background:#f8f9fa;border-radius:4px;">${explanationText}</div>`;

    content.innerHTML = contentHTML;

    nextBtn.style.display = "";
    nextBtn.onclick = function () {
      // 次の問題へ
      if (
        (stepNum === 1 && quizNum === 5) ||
        (stepNum === 2 && quizNum === 6) ||
        (stepNum === 3 && quizNum === 6)
      ) {
        window.location.href = `step.html?step=${stepNum}&from=quiz`;
      } else {
        window.location.href = `quiz.html?step=${stepNum}&quiz=${quizNum + 1}`;
      }
    };
    if (
      (stepNum === 1 && quizNum === 5) ||
      (stepNum === 2 && quizNum === 6) ||
      (stepNum === 3 && quizNum === 6)
    ) {
      nextBtn.innerText = "トップに戻る";
    } else {
      nextBtn.innerText = "次の問題へ→";
    }
  } else {
    // 不正解時
    content.innerHTML = `
      <div style="color:#7991ff;font-size:2em;font-weight:bold;">不正解</div>
      <div style="font-size:5em;color:#7991ff;">&#10006;</div>
      <div style="margin-top:10px;font-weight:bold;">ヒントを見てみよう</div>
    `;
    nextBtn.style.display = "none";
  }

  modal.style.display = "flex";
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };
}

function showStepResultModal(isCorrect, stepNum) {
  const modal = document.getElementById("result-modal");
  const content = document.getElementById("result-content");
  const closeBtn = document.getElementById("modal-close-btn");
  const nextBtn = document.getElementById("modal-next-btn");

  // 任意のSTEP解説（必要に応じて編集）
  const stepExplanations = {
    1: "冊子と5枚の謎を正しく組み合わせるのがポイントでした。",
    2: "宇宙船の6つの謎を冊子と照合して順に解読します。",
    3: "これまでの情報を総合し、最終パスワードを導きます。",
  };

  if (isCorrect) {
    // アンロック処理
    const unlocked = JSON.parse(localStorage.getItem("unlockedStep") || "[1]");
    if (!unlocked.includes(stepNum)) unlocked.push(stepNum);
    if (stepNum < 3 && !unlocked.includes(stepNum + 1))
      unlocked.push(stepNum + 1);
    localStorage.setItem("unlockedStep", JSON.stringify(unlocked));

    const imgPath = `images/step${stepNum}-ans.png`; // あれば表示
    content.innerHTML = `
      <div style="color:#f08080;font-size:2em;font-weight:bold;">正解</div>
      <img src="${imgPath}" onerror="this.style.display='none'" style="width:90%;max-width:300px;margin:10px auto;border:2px solid #ddd;border-radius:8px;">
      <div style="margin-top:10px;font-size:0.9em;line-height:1.4;text-align:left;padding:10px;background:#f8f9fa;border-radius:4px;">
        ${stepExplanations[stepNum] || "クリア！次へ進もう。"}
      </div>
    `;
    nextBtn.style.display = "";
    nextBtn.innerText = stepNum < 3 ? "次のSTEPへ→" : "Lastへ→";
    nextBtn.onclick = function () {
      if (stepNum < 3) window.location.href = `step.html?step=${stepNum + 1}`;
      else window.location.href = "last.html";
    };
  } else {
    content.innerHTML = `
      <div style="color:#7991ff;font-size:2em;font-weight:bold;">不正解</div>
      <div style="font-size:5em;color:#7991ff;">&#10006;</div>
      <div style="margin-top:10px;font-weight:bold;">ヒントを見てみよう</div>
    `;
    nextBtn.style.display = "none";
    nextBtn.onclick = null;
  }

  modal.style.display = "flex";
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };
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
const stepNum = parseInt(params.get("step")) || 1;
const stepData = { 1: 5, 2: 6, 3: 6 };

const stepTitleElem = document.getElementById("step-title");
if (stepTitleElem) stepTitleElem.innerText = `STEP${stepNum}`;
//document.getElementById("prev-btn").disabled = stepNum===1;
//document.getElementById("prev-btn").onclick=()=>goToStep(stepNum-1);

generateStepButtons(stepNum, stepData[stepNum]);

// アンロック済みSTEP更新
if (!unlockedStep.includes(stepNum)) {
  unlockedStep.push(stepNum);
  localStorage.setItem("unlockedStep", JSON.stringify(unlockedStep));
}

function goToStep(step, fromQuiz) {
  if (step === 0) window.location.href = "index.html";
  else if (fromQuiz) window.location.href = `step.html?step=${step}&from=quiz`;
  else window.location.href = `step.html?step=${step}`;
}

window.addEventListener("DOMContentLoaded", function () {
  // STEP番号取得
  const params = new URLSearchParams(window.location.search);
  const stepNum = parseInt(params.get("step") || "", 10);
  const fromQuiz = params.get("from") === "quiz";
  console.log(stepData);

  // ストーリーオーバーレイの表示関数
  function showStoryOverlay() {
    if (document.getElementById("story-overlay") != null) {
      document.getElementById("story-overlay").style.display = "flex";
    }
    // すべて非表示
    document
      .querySelectorAll(".step-story-section")
      .forEach((sec) => sec.classList.remove("active"));
    // 対象だけ表示
    const target = document.getElementById(`story-section-step${stepNum}`);
    if (target) target.classList.add("active");
  }

  // ストーリーを振り返るボタン
  const storyBtn = document.querySelector(".story-btn");
  if (storyBtn) {
    storyBtn.addEventListener("click", showStoryOverlay);
  }

  // ページ初回表示時のみStory自動表示（from=quizならスキップ）
  if (!fromQuiz) {
    showStoryOverlay();
  }

  // 閉じるボタン
  const closeStoryBtn = document.getElementById("close-story");
  if (closeStoryBtn) {
    closeStoryBtn.onclick = function () {
      document.getElementById("story-overlay").style.display = "none";
    };
  }
  // ヒントボタンの表示切替
});

//goodとbad.htmlの戻るボタン
if (document.getElementById("last-close-btn") != null) {
  document.getElementById("last-close-btn").addEventListener("click", () => {
    window.location.href = "last.html";
  });
}
