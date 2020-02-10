
class Game {
	constructor(row, col ,countMax, box, time) {
		this.row = row;
		this.col = col;
		this.countMax = countMax; // 生成雷的数量
		this.box = box;	
		this.time = time;
		this.restart = restart;
		this.isFirstOpen = true;
		this.timer = false;
		this.elements = [];  // 存放每个元素的二维数组
		this.gameOver = false;
	}


	//初始化函数，为添加事件和添加扫雷盘
	init() {
		this.restart.addEventListener('click', () => {
			location.reload();
		}, false);
		this.init_elements();
	}


	//初始化得到扫雷盘的二维数组
	init_elements() {
		let grid = '';
		for (let i = 0; i < this.row; i++) {
			grid += '<tr>'
			for(let j = 0; j < this.col; j++) {
				grid += '<td><span class="blocks" backgroundColor="white";></span></td>';
			}
			grid += '<tr>';
		}
		this.box.innerHTML = grid;
		var blocks = document.getElementsByClassName('blocks');
		//初始化属性
		for (let i = 0; i < blocks.length; i++) {	
			blocks[i].isMine = false;
			blocks[i].count = 0;
		}
		//将所有的放个放个存入二维数组elements中
		for( let i = 0; i < blocks.length; i++) {
			if (i % this.col === 0) {
				this.elements.push(new Array());
			}
			blocks[i].count = 0;
			this.elements[parseInt(i / this.col)].push(blocks[i]);
			this.elements[parseInt(i / this.col)][parseInt(i % this.col)].addEventListener('mousedown', () => {
				this.element_click(parseInt(i / this.col), parseInt(i % this.col), event);
			}, false);
		}
	}

	//每个方块元素的点击触发函数
	element_click(i, j, e) {
		if(this.gameOver) { return }
		if(!this.timer) {
			this.timebegin();
		}
		console.log(i + ',' + j);

		if(this.elements[i][j].isOpen) {
			return;
		}

		if(e.button === 0) {
			// 鼠标左键事件
			if(this.isFirstOpen) {
				this.isFirstOpen = false;
				this.begin = true;
				this.createMine(i, j);
			}
			this.open_element(i, j);
			this.judgeover();
		} else if(e.button === 2){
			this.elements[i][j].innerHTML === '🧨'? this.elements[i][j].innerHTML = '': this.elements[i][j].innerHTML = '🧨';
		}
	}

	// 判断游戏是否成功函数
	judgeover() {
		for (let i = 0; i < this.row; i++) {
			for (let j = 0; j < this.col; j++) {
				// 如果某个方格没有被打开而且不是地雷
				if(!this.elements[i][j].isOpen && !this.elements[i][j].isMine) {
					return;
				}
			}
		}
		clearInterval(this.timer);
		this.gameOver = true;
		alert('你赢了！用时' + this.time.innerHTML);
	}

	//打开坐标为 i, j的方块
	open_element(i, j) {
		 //被点击的元素
		this.elements[i][j].style.background= "#ccc";
		this.elements[i][j].isOpen = true;

		if(this.elements[i][j].isMine) {
			for(let a = 0; a < this.row; a++) {
				for(let b = 0; b < this.col; b++) {
					if(this.elements[a][b].isMine) {
						this.elements[a][b].innerHTML = '🧨';
						this.elements[a][b].style.background = "#ccc";
					}
				}
			}
			clearInterval(this.timer);
			this.gameOver = true;
			alert('游戏结束！');
			this.restart.style.opacity = 1;
		} else if(!this.elements[i][j].count) {
			this.chainReact(i, j);
		} else {
			this.elements[i][j].innerHTML = this.elements[i][j].count;
		} 
	}


	// 方格连锁打开函数
	chainReact(i, j) {
		for(let a = i - 1; a < i + 2; a ++) {
			for(let b = j - 1; b < j + 2; b ++) {
				if(a > -1 && b > -1 && a < this.row && b < this.col && !this.elements[a][b].isOpen && !this.elements[a][b].isMine ) {
					//递归打开方格
					this.open_element(a, b);
				}
			}
		}
	}

	//创建地雷函数
	createMine(i, j) {
		let count = 0;
		while(count < this.countMax) {
			let im = parseInt(Math.random() * this.row);
			let jm = parseInt(Math.random() * this.col);
			if(im != i && im != j && !this.elements[im][jm].isMine) {
				this.elements[im][jm].count = 0;
				this.elements[im][jm].isMine = true;
				count++;
				// 让该9宫格内的地雷数字+1
				for (let a = im - 1; a < im + 2; a++) {
					for (let b = jm - 1; b < jm + 2; b++) {
						//判断是否越界
						if (b > -1 && a > -1 && b < this.col && a < this.row) {
							this.elements[a][b].count++;
						}
					}
				}
			}
		}
	}

	//开始计时
	timebegin() {
		this.time.innerHTML = '0s';
		this.timer = setInterval(() => {
			this.time.innerHTML = parseInt(this.time.innerHTML) + 1 + 's';
		}, 1000);
	}
}


var obj = new Game(10, 10, 10, document.getElementById('box'), document.getElementById('time'), document.getElementById('restart'));

obj.init();
