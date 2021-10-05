/**
* @module Grafico que genera las ventas diarias
* @param {*} container : DOM CONTAINER GRAPHIC
* @returns graphic
*/
const historyTheft = [25];
const ventas_graficas_diaria = () => {
    this.init;
    this.options;
    return {
        show: () => this.init.setOption(this.options),
        getReport: () => this.init,

        setReport: (container, data, head) => {

            this.init = echarts.init(container);
            this.options = {
                title: {
                    text: head.title,
                    subtext: head.subtitle
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                calculable: true,
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    boundaryGap: true,
                    data: ['Hoy']
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: true
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                ],
                color: [
                    "#3bc47d",
                ],
                series: [
                    {
                        name: 'Venta(s)',
                        type: 'bar',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: data
                    }
                ]
            };

            return this.init;
        }
    }
};

/**
* @module Grafico que genera las ventas semanales
* @param {*} container : DOM CONTAINER GRAPHIC
* @returns graphic
*/

const data_semanal = [
    ["2018-02-15", 1], ["2018-06-15", 7], ["2018-08-15", 3], ["2018-09-15", 4]
];
const ventas_graficas_semanal = () => {
    this.init;
    this.options;

    return {
        show: () => this.init.setOption(this.options),
        getReport: () => this.init,

        setReport: (container, data, head) => {

            data = data.length > 0 ? data : [['29-04-2021', 0], ['28-04-2021', 0], ['27-04-2021', 0], ['26-04-2021', 0], ['30-04-2021', 0]]

            this.init = echarts.init(container);
            this.options = {
                title: {
                    text: head.title,
                    subtext: head.subtitle
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: { type: ['line', 'bar'] },
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                calculable: true,
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: true
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                ],
                color: [
                    "#3bc47d",
                ],
                series: [
                    {
                        name: 'Venta(s)',
                        type: 'line',
                        smooth: true,
                        data: data
                    }
                ]
            };

            return this.init;

        }
    }
};

/**
* @module Grafico que genera las ventas popular
* @param {*} container : DOM CONTAINER GRAPHIC
* @returns graphic
*/

const ventas_graficas_popular = () => {
    this.init;
    this.options;
    return {
        show: () => this.init.setOption(this.options),
        getReport: () => this.init,
        setReport: (container, rawData, head) => {
            this.init = echarts.init(container);

            this.options = {
                title: {
                    text: head.title,
                    subtext: head.subtitle,
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                },
                series: [
                    {
                        name: 'Venta(s)',
                        type: 'pie',
                        radius: '50%',
                        data: rawData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                color: [
                    '#f5365c',
                    '#2bffc6',
                    '#11cdef'
                ]
            };
        }
    }
};