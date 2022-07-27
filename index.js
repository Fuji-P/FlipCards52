"use strict";

//配列シャッフル
Array.prototype.shuffle = function () {
	let i = this.length;
	while (i) {
		let j = Math.floor(Math.random() * i);
		let t = this[--i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
}

//広域変数
let timer = NaN;	//1秒毎にtick()を呼び出すためのタイマー
let score = 0;		//2枚目にめくったカードをしばらく表示状態にしておくためのタイマー
let flipTimer;		//何ペア一致したか
let prevCard;		//1枚目にめくったカード
let startTime;		//最初にゲームを開始した時刻

//初期化関数
function init() {
	let table = document.getElementById("table");
	let cards = [];
	//52枚のカードをランダムに並び替える
	for (let i = 1; i <= 13; i++) {
		cards.push(i);
		cards.push(i);
		cards.push(i);
		cards.push(i);
	}
	cards.shuffle();
	//カードを並べる
	for (let i = 0; i < 4; i++) {
		let tr = document.createElement("tr");
		for (let j = 0; j < 13; j++) {
			let td = document.createElement("td");
			td.className = "card back";
			td.number = cards[i * 13 + j];
			td.onclick = flip;
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	startTime = new Date();
	timer = setInterval(tick, 1000);
}

//経過時間計測用タイマー
function tick() {
	let now = new Date();
	//ゲーム開始時の値との差分をとり、1000で割ることにより秒単位の経過時間を求める
	let elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
	document.getElementById("time").textContent = elapsed;
}

//カード裏返し
function flip(e) {
	let src = e.srcElement;
	//flipTimerが値を保持している間(2枚が表になってもしばらく数字が表示されている間)、
	//もしくはすでに表になったカードがクリックされた場合
	if (flipTimer || src.textContent != "") {
		return;
	}
	//クリックされたカードを表にする
	let num = src.number;
	src.className = "card";
	src.textContent = num;
	//クリックされたカードが一枚目だったとき
	if (prevCard == null) {
		//現在のカードを代入
		prevCard = src;
		return;
	}
	//二枚目がクリックされたとき
	//一枚目と同じカードのとき
	if (prevCard.number == num) {
		//10枚目になったときは全部のカードが裏返し
		if (++score == 10) {
			//経過時間を計測するためのtimerを止める
			clearInterval(timer);
		}
		//1枚目をクリア
		prevCard = null;
		//元に裏返すためのタイマーを停止
		clearTimeout(flipTimer);
	}
	//1枚目と2枚目が異なるとき
	else {
		//1秒後に関数を実行
		flipTimer = setTimeout(function () {
			//2枚目のカード
			src.className = "card back";
			src.textContent = "";
			//1枚目のカード
			prevCard.className = "card back";
			prevCard.textContent = "";
			//初期化して最初の状態に戻す
			prevCard = null;
			flipTimer = NaN;
		}, 1000);
	}
}