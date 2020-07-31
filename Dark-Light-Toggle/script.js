// 把主图标的容器拿过来
const sunMoonContainer = document.querySelector('.sun-moon-container')

// 添加点击事件,当点击之后会toggle在body身上的dark类
document.querySelector('.theme-toggle-button').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    //声明一个常量用于计算旋转值
    //getComputedStyle(某元素).getPropertyValue(某元素里面的某属性) 获取某个元素里的所有style的值,后调用当中某一个属性,解析成为数字
    const currentRotation = parseInt(getComputedStyle(sunMoonContainer).getPropertyValue('--rotation'))
    //容器的style设定属性
    sunMoonContainer.style.setProperty('--rotation', currentRotation + 180)
})

