class Obj {
	constructor(game, oGo, oMain) {
		this.game = game;
		this.oGo = oGo;
		this.oMain = oMain;
		this.score = 0;
		this.speed = 5;
		this.timer = null;
		this.flag = false;
	}

	init() {
		this.oGo.addEventListener('click', () => {
			this.oGo.style.display = 'none';
			this.oMain.style.top = '-150px';
			this.oMain.innerHTML = '';
			this.move();
			this.handleClick();
		}, false);
	}

	// 控制块的下落
	move() {
		this.timer = setInterval(() => {
			this.render();
		}, 30);
	}

	//控制块的下落速度
	render() {
		this.oMain.style.top = this.oMain.offsetTop + this.speed + 'px';

		if(this.oMain.offsetTop >= 0) {
			this.renderRow();
			this.judgeLastRow();
			this.oMain.style.top = '-150px';
		}
	}


	// 渲染每一层的四个方块
	renderRow() {
		let index = Math.floor(Math.random() * 4);
		let oRow = document.createElement('div');
		oRow.setAttribute('class', 'row');

		for(let i = 0; i < 4; i++) {
			let oCol = document.createElement('div');
			oCol.setAttribute('class', 'col');
			oRow.appendChild(oCol);
		}
		var oTarget = oRow.childNodes[index];
		oTarget.classList.add('target');
		

		//向父元素第一个元素前插入
		this.oMain.insertBefore(oRow, this.oMain.childNodes[0]);
	}

	judgeLastRow() {
		// 判断最后一行是否包含target元素
		
		var rowNum = this.oMain.childNodes.length;
		if(rowNum == 6) {
			var oLastRow = this.oMain.childNodes[rowNum - 1];
			for(let i = 0; i < 4; i++) {
				if(oLastRow.childNodes[i].classList.contains('target')) {
					this.end();
					break;
				}
			}
			this.oMain.removeChild(oLastRow);
		}
		
	}
	//处理点击事件
	handleClick() {
		this.oMain.addEventListener('click', (e) => {
			var dom = e.target;
			var isTarget = dom.classList.contains('target')

			if(this.flag) { return }

			if(isTarget) {
				// 移除目标元素的class
				dom.classList.remove('target');
				dom.style.backgroundColor = '#ccc';
				this.score ++;
				this.levelup();
			} else {
				this.end();
			}
		}, false);
	}	

	levelup() {
		this.speed += .5;
	}

	end() {
		clearInterval(this.timer);	
		this.flag = false;
		alert('游戏结束, 累计分数为' + this.score);
	}
}

var obj = new Obj(document.getElementById('game'), document.getElementsByClassName('go')[0], document.getElementById('main'));
obj.init();