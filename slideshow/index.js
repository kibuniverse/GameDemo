


class SlidePage {
    constructor(_box_el, imgs_box_el, index_arr_el, bottom_arr_el, left_btn_el, right_btn_el) {
        this._box_el = _box_el;
        this.imgs_box_el = imgs_box_el;
        this.index_arr_el = index_arr_el;
        this.bottom_arr_el = Array.prototype.slice.call(bottom_arr_el); // 将NodeList类型转换为Array类型， 以便于使用数组的方法 不过用 for...of也可以遍历 NodeList类型 \
        this.left_btn_el = left_btn_el;
        this.right_btn_el = right_btn_el;
        this.auto_play_timer = null;
        this.is_cursor_leave = true;  
        this.is_play = false;  // 当前是否在播放
        this.index = 1;   // 初始下标值
    }
    // 初始化图片的位置
    init() {
        //初始化图片位置
        this.imgs_box_el.style.left = '-500px';
        
        // 打开自动播放计时器
        this.startAutoSlide(); 

        // 为按钮添加事件
        this.allAddEvent();  
        
    }
    // 添加事件的方法
    allAddEvent() {
        this._box_el.addEventListener('mouseenter', () => {
            this.is_cursor_leave = false;
            this.stopAutoSlide(); // 关闭自动播放计时器
        }, false);

        this._box_el.addEventListener('mouseleave', () => {
            this.is_cursor_leave = true;
            this.isStop();
        }, false);

        this.bottom_arr_el.forEach((item, index) => {
            // 为每一个按钮添加点击事件
            item.addEventListener('click', () => {
                let target_index = index + 1;
                console.log(`跳转至下标为${target_index}的图片`);
                if(target_index == this.index) {return;} // 若相等则退出
                if(!this.is_play) {
                    this.pageJump(target_index);
                }
            }, false);
        });

        this.left_btn_el.addEventListener('click', () => {
            if(!this.is_play) {
                this.pageJump(this.index - 1);
            }
        }, false);
        this.right_btn_el.addEventListener('click', () => {
            if(!this.is_play) {
                this.pageJump(this.index + 1);            }
        }, false);
    }

    // 开始自动滑动
    startAutoSlide() {
        this.auto_play_timer = setTimeout(() => {
            this.pageAutoSlideGo();
        }, 2000);
    }

    //停止自动滑动
    stopAutoSlide() {
        clearTimeout(this.auto_play_timer);
        this.auto_play_timer = null;
    }

    // 页面向前走
    pageAutoSlideGo() {
        let last_index = this.index; // 去除下标原点样式
        this.go(this.index, this.index + 1);
        this.changeIndexValue();

        // 页面跳转完成后改变下标展示
        this.changeIndexShow(last_index);
        this.auto_play_timer = setTimeout(() => {
            this.pageAutoSlideGo();
        }, 2000);
    }

    //页面向后退
    pageAutoSlideBack() {
        let last_index = this.index; // 去除下标原点样式
        this.go(this.index, this.index - 1);
        this.changeIndexValue();

        // 页面跳转完成后改变下标展示
        this.changeIndexShow(last_index);
        this.auto_play_timer = setTimeout(() => {
            this.pageAutoSlideBack();
        }, 2000);
    }

    // 页面跳
    pageJump(target_index) {
        let last_index = this.index;
        this.go(this.index, target_index);
        
        this.changeIndexValue();
        this.changeIndexShow(last_index);
    }

    /*
        负责图片移动的函数
        now_index 为当前下标
        target_index 为目标下标
     */
    go(now_index, target_index) {
        this.is_play = true;  // 开始了播放
        this.index = target_index;  // 修改当前的下标为目标下标
        let slide_distant = (target_index - now_index) * 500;  // 计算出需要滑动的距离
        let step = slide_distant > 0 ? -2 : 2;  //  根据滑动的正负确定出需要滑动的方向
        let distant_count = 0; // 记录每次滑动的距离
        slide_distant = Math.abs(slide_distant);
        let timer = setInterval(() => {
            this.imgs_box_el.style.left = parseInt(this.imgs_box_el.style.left) + step + 'px';
            distant_count += 2;
            // 如果距离足够则清除计数器
            if(distant_count >= slide_distant) {
                clearInterval(timer);
                this.is_play = false; // 本次播放结束
                this.isStop();  // 判断是否已经停止自动播放 , 因为鼠标移入会停止自动轮播
                if(parseInt(this.imgs_box_el.style.left) <= -3500) {
                    this.imgs_box_el.style.left = '-500px';
                }
                if(parseInt(this.imgs_box_el.style.left) >= 0) {
                    this.imgs_box_el.style.left = '-3000px';
                }
                
            }
        }, 2);
    }

    // 判断index的值是否已经到数组最后一位
    changeIndexValue() {
        if(this.index == 7) {
            this.index = 1;
        }
        if(this.index == 0) {
            this.index = 6;
        }
    }

    // 判断页面时候停止的函数
    isStop() {
        // 若鼠标已经移出 且 未在播放 且 自动播放停止 则 启动自动播放
        if(this.is_cursor_leave && this.auto_play_timer == null && this.is_play == false) {
            this.startAutoSlide();
        }
    }
    
    // 改变下标展示的方法
    changeIndexShow(last_index) {
        this.bottom_arr_el[last_index - 1].style.backgroundColor = 'gray';
        // 思路， 得到当前index的值并改变对应的bottom的背景色
        let change_index = this.index - 1;
        this.bottom_arr_el[change_index].style.backgroundColor = 'salmon';
    }
    
}


let slide_img = new SlidePage(  document.getElementById('box'),
                                document.getElementsByClassName('img_box')[0], 
                                document.getElementsByClassName('index_bottom'), 
                                document.getElementsByClassName('index_bottom'),
                                document.getElementById('left_'),
                                document.getElementById('right_'));

slide_img.init();
