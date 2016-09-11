{"changed":true,"filter":false,"title":"index.js","tooltip":"/django-react-redux-jwt-base/src/static/containers/Protected/index.js","value":"import React from 'react';\nimport { connect } from 'react-redux';\nimport { bindActionCreators } from 'redux';\nimport * as actionCreators from '../../actions/data';\nimport {BarChart, ScatterChart, LineChart} from 'rd3';\n\nimport './style.scss';\n\n\nclass ProtectedView extends React.Component {\n    \n    barData = [\n      {\n        \"name\": \"Series A\",\n        \"values\": [\n          { \"x\": 1, \"y\":  91},\n          { \"x\": 2, \"y\": 290},\n          { \"x\": 3, \"y\": -25},\n        ]\n      },\n      {  \n        \"name\": \"Series B\",\n        \"values\": [\n          { \"x\": 1, \"y\":  9},\n          { \"x\": 2, \"y\": 49},\n          { \"x\": 3, \"y\": -20},\n        ]\n      },\n      {  \n        \"name\": \"Series C\",\n        \"values\": [\n          { \"x\": 1, \"y\":  14},\n          { \"x\": 2, \"y\": 77},\n          { \"x\": 3, \"y\": -70},\n        ]\n      }\n    ];\n    \n    lineData = [{ \n      values: [ { x: 0, y: 20 }, { x: 1, y: 30 }, { x: 2, y: 10 }, { x: 3, y: 5 }, { x: 4, y: 8 }, { x: 5, y: 15 }, { x: 6, y: 10 } ],\n      strokeWidth: 3,\n      strokeDashArray: \"5,5\"\n    }]\n    \n    scatterData = [{\n        name: \"Scatter Boys\",\n        values: [ { x: 0, y: 20 }, { x: 5, y: 7 }, { x: 8, y: 3 }, { x: 13, y: 33 }, { x: 12, y: 10 }, { x: 13, y: 15 }, { x: 24, y: 8 }, { x: 25, y: 15 }, { x: 16, y: 10 }, { x: 16, y: 10 }, { x: 19, y: 30 }, { x: 14, y: 30 }]\n      }]\n\n    ComponentWillMount () {\n      \n        const request = new XMLHttpRequest();\n        request.open('GET', '/api/v1/retrieve', true);\n        request.setRequestHeader(\"Content-Type\", \"application/json;charset=UTF-8\");\n        \n        request.onload = function() {\n          if (request.status >= 200 && request.status < 400) {\n            // Success!\n            var resp = request.responseText;\n            //Parse the list of tuples sent back and make it a list of list\n            //var list = [['foo', 12], ['bar', 60]];\n            var list = resp;\n            //TODO: Insert a cordcloud_canvas in html\n            WordCloud(document.getElementById('wordcloud_canvas'), { list: list });\n            console.log(resp)\n          } else {\n            // We reached our target server, but it returned an error\n            console.log(\"ITS FUCKED\");\n          }\n        };\n        \n        request.onerror = function() {\n          // There was a connection error of some sort\n          console.log(\"ITS ALSO FUCKED\")\n        };\n        request.send();\n    }\n    \n    renderWordCloud = (schoolName) => {\n      const request = new XMLHttpRequest();\n        request.open('GET', '/api/v1/retrieve', true);\n        request.setRequestHeader(\"Content-Type\", \"application/json;charset=UTF-8\");\n        \n        request.onload = function() {\n          if (request.status >= 200 && request.status < 400) {\n            // Success!\n            var resp = request.responseText;\n            //Parse the list of tuples sent back and make it a list of list\n            var list = JSON.parse(resp);\n            WordCloud(document.getElementById('wordcloud_canvas'), { list: list });\n            console.log(resp)\n          } else {\n            // We reached our target server, but it returned an error\n            console.log(\"ITS FUCKED\");\n          }\n        };\n        \n        request.onerror = function() {\n          // There was a connection error of some sort\n          console.log(\"ITS ALSO FUCKED\")\n        };\n        request.send(JSON.stringify({schoolName: schoolName}));\n    }\n    \n    // renderBestWords (schoolName) => {\n    //   const request = new XMLHttpRequest();\n    //     request.open('GET', '/api/v1/retrieve2', true);\n    //     request.setRequestHeader(\"Content-Type\", \"application/json;charset=UTF-8\");\n        \n    //     request.onload = function() {\n    //       if (request.status >= 200 && request.status < 400) {\n    //         // Success!\n    //         var resp = request.responseText;\n    //         //Parse the list of tuples sent back and make it a list of list\n    //         var list = JSON.parse(resp);\n    //         WE DRAW A SOME FANCY GRAPH\n    //         \n            \n    //         console.log(resp)\n    //       } else {\n    //         // We reached our target server, but it returned an error\n    //         console.log(\"ITS FUCKED\");\n    //       }\n    //     };\n        \n    //     request.onerror = function() {\n    //       // There was a connection error of some sort\n    //       console.log(\"ITS ALSO FUCKED\")\n    //     };\n    //     request.send(JSON.stringify({schoolName: schoolName}));\n    // }\n  \n    static propTypes = {\n        isFetching: React.PropTypes.bool.isRequired,\n        data: React.PropTypes.string,\n        token: React.PropTypes.string.isRequired,\n        actions: React.PropTypes.object.isRequired\n    };\n\n    render() {\n        return (\n            <div className=\"data\">\n                <div className=\"scatter-plot\">\n                  <ScatterChart\n                    data={this.scatterData}\n                    width={500}\n                    height={400}\n                    domain={{x:[-15,], y:[-15,]}}\n                  />\n                </div>\n                <div className=\"line-graph\">\n                  <LineChart\n                    legend={true}\n                    data={this.lineData}\n                    width='100%'\n                    height={400}\n                    viewBoxObject={{\n                      x: 0,\n                      y: 0,\n                      width: 500,\n                      height: 400\n                    }}\n                    yAxisLabel=\"GPA\"\n                    xAxisLabel=\"SAT\"\n                    domain={{x: [,6], y: [-10,]}}\n                    gridHorizontal={true}\n                  />\n                </div>\n                <div className=\"word-cloud\">\n                   <canvas id = \"wordcloud_canvas\" width = \"122\" height = \"80\" lang> == $0 </canvas>\n                </div>\n                {this.renderWordCloud(\"Penn\")}\n            </div>\n        );\n    }\n}\n\nconst mapStateToProps = (state) => {\n    return {\n        data: state.data.data,\n        isFetching: state.data.isFetching\n    };\n};\n\nconst mapDispatchToProps = (dispatch) => {\n    return {\n        actions: bindActionCreators(actionCreators, dispatch)\n    };\n};\n\nexport default connect(mapStateToProps, mapDispatchToProps)(ProtectedView);\nexport { ProtectedView as ProtectedViewNotConnected };\n","undoManager":{"mark":17,"position":100,"stack":[[{"start":{"row":168,"column":100},"end":{"row":168,"column":101},"action":"insert","lines":["s"],"id":947}],[{"start":{"row":168,"column":101},"end":{"row":168,"column":102},"action":"insert","lines":[">"],"id":948}],[{"start":{"row":166,"column":16},"end":{"row":166,"column":17},"action":"insert","lines":["/"],"id":949}],[{"start":{"row":166,"column":17},"end":{"row":166,"column":18},"action":"insert","lines":["/"],"id":950}],[{"start":{"row":168,"column":19},"end":{"row":168,"column":20},"action":"remove","lines":["/"],"id":951}],[{"start":{"row":168,"column":18},"end":{"row":168,"column":19},"action":"remove","lines":["/"],"id":952}],[{"start":{"row":168,"column":92},"end":{"row":168,"column":93},"action":"remove","lines":["\\"],"id":953}],[{"start":{"row":168,"column":92},"end":{"row":168,"column":93},"action":"insert","lines":["/"],"id":954}],[{"start":{"row":166,"column":16},"end":{"row":166,"column":89},"action":"remove","lines":["//<canvas id = \"wordcloud_canvas\" width = \"122\" height = \"80\" lang> == $0"],"id":955}],[{"start":{"row":166,"column":14},"end":{"row":166,"column":16},"action":"remove","lines":["  "],"id":956}],[{"start":{"row":166,"column":12},"end":{"row":166,"column":14},"action":"remove","lines":["  "],"id":957}],[{"start":{"row":166,"column":10},"end":{"row":166,"column":12},"action":"remove","lines":["  "],"id":958}],[{"start":{"row":166,"column":8},"end":{"row":166,"column":10},"action":"remove","lines":["  "],"id":959}],[{"start":{"row":166,"column":6},"end":{"row":166,"column":8},"action":"remove","lines":["  "],"id":960}],[{"start":{"row":166,"column":4},"end":{"row":166,"column":6},"action":"remove","lines":["  "],"id":961}],[{"start":{"row":166,"column":2},"end":{"row":166,"column":4},"action":"remove","lines":["  "],"id":962}],[{"start":{"row":166,"column":0},"end":{"row":166,"column":2},"action":"remove","lines":["  "],"id":963}],[{"start":{"row":165,"column":22},"end":{"row":166,"column":0},"action":"remove","lines":["",""],"id":964}],[{"start":{"row":104,"column":24},"end":{"row":104,"column":25},"action":"insert","lines":["s"],"id":965}],[{"start":{"row":104,"column":25},"end":{"row":104,"column":26},"action":"insert","lines":["c"],"id":966}],[{"start":{"row":104,"column":25},"end":{"row":104,"column":26},"action":"remove","lines":["c"],"id":967}],[{"start":{"row":104,"column":24},"end":{"row":104,"column":25},"action":"remove","lines":["s"],"id":968}],[{"start":{"row":104,"column":24},"end":{"row":104,"column":25},"action":"insert","lines":["s"],"id":969}],[{"start":{"row":104,"column":25},"end":{"row":104,"column":26},"action":"insert","lines":["c"],"id":970}],[{"start":{"row":104,"column":26},"end":{"row":104,"column":27},"action":"insert","lines":["h"],"id":971}],[{"start":{"row":104,"column":27},"end":{"row":104,"column":28},"action":"insert","lines":["o"],"id":972}],[{"start":{"row":104,"column":28},"end":{"row":104,"column":29},"action":"insert","lines":["o"],"id":973}],[{"start":{"row":104,"column":29},"end":{"row":104,"column":30},"action":"insert","lines":["l"],"id":974}],[{"start":{"row":104,"column":30},"end":{"row":104,"column":31},"action":"insert","lines":["N"],"id":975}],[{"start":{"row":104,"column":31},"end":{"row":104,"column":32},"action":"insert","lines":["m"],"id":976}],[{"start":{"row":104,"column":32},"end":{"row":104,"column":33},"action":"insert","lines":["a"],"id":977}],[{"start":{"row":104,"column":32},"end":{"row":104,"column":33},"action":"remove","lines":["a"],"id":978}],[{"start":{"row":104,"column":31},"end":{"row":104,"column":32},"action":"remove","lines":["m"],"id":979}],[{"start":{"row":104,"column":31},"end":{"row":104,"column":32},"action":"insert","lines":["a"],"id":980}],[{"start":{"row":104,"column":32},"end":{"row":104,"column":33},"action":"insert","lines":["m"],"id":981}],[{"start":{"row":104,"column":33},"end":{"row":104,"column":34},"action":"insert","lines":["e"],"id":982}],[{"start":{"row":127,"column":11},"end":{"row":127,"column":26},"action":"remove","lines":["request.send();"],"id":983},{"start":{"row":127,"column":11},"end":{"row":127,"column":66},"action":"insert","lines":["request.send(JSON.stringify({schoolName: schoolName}));"]}],[{"start":{"row":114,"column":43},"end":{"row":115,"column":0},"action":"insert","lines":["",""],"id":984},{"start":{"row":115,"column":0},"end":{"row":115,"column":4},"action":"insert","lines":["    "]}],[{"start":{"row":115,"column":4},"end":{"row":115,"column":5},"action":"insert","lines":["/"],"id":985}],[{"start":{"row":115,"column":5},"end":{"row":115,"column":6},"action":"insert","lines":["/"],"id":986}],[{"start":{"row":115,"column":6},"end":{"row":115,"column":7},"action":"insert","lines":[" "],"id":987}],[{"start":{"row":115,"column":7},"end":{"row":115,"column":8},"action":"insert","lines":[" "],"id":988}],[{"start":{"row":115,"column":8},"end":{"row":115,"column":9},"action":"insert","lines":[" "],"id":989}],[{"start":{"row":115,"column":9},"end":{"row":115,"column":10},"action":"insert","lines":[" "],"id":990}],[{"start":{"row":115,"column":10},"end":{"row":115,"column":11},"action":"insert","lines":[" "],"id":991}],[{"start":{"row":115,"column":11},"end":{"row":115,"column":12},"action":"insert","lines":[" "],"id":992}],[{"start":{"row":115,"column":12},"end":{"row":115,"column":13},"action":"insert","lines":[" "],"id":993}],[{"start":{"row":115,"column":13},"end":{"row":115,"column":14},"action":"insert","lines":[" "],"id":994}],[{"start":{"row":115,"column":14},"end":{"row":115,"column":15},"action":"insert","lines":["W"],"id":995}],[{"start":{"row":115,"column":15},"end":{"row":115,"column":16},"action":"insert","lines":["E"],"id":996}],[{"start":{"row":115,"column":15},"end":{"row":115,"column":16},"action":"remove","lines":["E"],"id":997}],[{"start":{"row":115,"column":14},"end":{"row":115,"column":15},"action":"remove","lines":["W"],"id":998}],[{"start":{"row":115,"column":14},"end":{"row":115,"column":15},"action":"insert","lines":[" "],"id":999}],[{"start":{"row":115,"column":15},"end":{"row":115,"column":16},"action":"insert","lines":["w"],"id":1000}],[{"start":{"row":115,"column":15},"end":{"row":115,"column":16},"action":"remove","lines":["w"],"id":1001}],[{"start":{"row":115,"column":14},"end":{"row":115,"column":15},"action":"remove","lines":[" "],"id":1002}],[{"start":{"row":115,"column":14},"end":{"row":115,"column":15},"action":"insert","lines":[" "],"id":1003}],[{"start":{"row":115,"column":15},"end":{"row":115,"column":16},"action":"insert","lines":["W"],"id":1004}],[{"start":{"row":115,"column":16},"end":{"row":115,"column":17},"action":"insert","lines":["E"],"id":1005}],[{"start":{"row":115,"column":17},"end":{"row":115,"column":18},"action":"insert","lines":[" "],"id":1006}],[{"start":{"row":115,"column":18},"end":{"row":115,"column":19},"action":"insert","lines":["D"],"id":1007}],[{"start":{"row":115,"column":19},"end":{"row":115,"column":20},"action":"insert","lines":["R"],"id":1008}],[{"start":{"row":115,"column":20},"end":{"row":115,"column":21},"action":"insert","lines":["W"],"id":1009}],[{"start":{"row":115,"column":21},"end":{"row":115,"column":22},"action":"insert","lines":["A"],"id":1010}],[{"start":{"row":115,"column":21},"end":{"row":115,"column":22},"action":"remove","lines":["A"],"id":1011}],[{"start":{"row":115,"column":20},"end":{"row":115,"column":21},"action":"remove","lines":["W"],"id":1012}],[{"start":{"row":115,"column":20},"end":{"row":115,"column":21},"action":"insert","lines":["A"],"id":1013}],[{"start":{"row":115,"column":21},"end":{"row":115,"column":22},"action":"insert","lines":["W"],"id":1014}],[{"start":{"row":115,"column":22},"end":{"row":115,"column":23},"action":"insert","lines":[" "],"id":1015}],[{"start":{"row":115,"column":23},"end":{"row":115,"column":24},"action":"insert","lines":["A"],"id":1016}],[{"start":{"row":115,"column":24},"end":{"row":115,"column":25},"action":"insert","lines":[" "],"id":1017}],[{"start":{"row":115,"column":25},"end":{"row":115,"column":26},"action":"insert","lines":["G"],"id":1018}],[{"start":{"row":115,"column":25},"end":{"row":115,"column":26},"action":"remove","lines":["G"],"id":1019}],[{"start":{"row":115,"column":25},"end":{"row":115,"column":26},"action":"insert","lines":["S"],"id":1020}],[{"start":{"row":115,"column":26},"end":{"row":115,"column":27},"action":"insert","lines":["O"],"id":1021}],[{"start":{"row":115,"column":27},"end":{"row":115,"column":28},"action":"insert","lines":["M"],"id":1022}],[{"start":{"row":115,"column":28},"end":{"row":115,"column":29},"action":"insert","lines":["E"],"id":1023}],[{"start":{"row":115,"column":29},"end":{"row":115,"column":30},"action":"insert","lines":[" "],"id":1024}],[{"start":{"row":115,"column":30},"end":{"row":115,"column":31},"action":"insert","lines":["F"],"id":1025}],[{"start":{"row":115,"column":31},"end":{"row":115,"column":32},"action":"insert","lines":["A"],"id":1026}],[{"start":{"row":115,"column":32},"end":{"row":115,"column":33},"action":"insert","lines":["N"],"id":1027}],[{"start":{"row":115,"column":33},"end":{"row":115,"column":34},"action":"insert","lines":["C"],"id":1028}],[{"start":{"row":115,"column":34},"end":{"row":115,"column":35},"action":"insert","lines":["Y"],"id":1029}],[{"start":{"row":115,"column":35},"end":{"row":115,"column":36},"action":"insert","lines":[" "],"id":1030}],[{"start":{"row":115,"column":36},"end":{"row":115,"column":37},"action":"insert","lines":["G"],"id":1031}],[{"start":{"row":115,"column":37},"end":{"row":115,"column":38},"action":"insert","lines":["A"],"id":1032}],[{"start":{"row":115,"column":38},"end":{"row":115,"column":39},"action":"insert","lines":["R"],"id":1033}],[{"start":{"row":115,"column":38},"end":{"row":115,"column":39},"action":"remove","lines":["R"],"id":1034}],[{"start":{"row":115,"column":37},"end":{"row":115,"column":38},"action":"remove","lines":["A"],"id":1035}],[{"start":{"row":115,"column":37},"end":{"row":115,"column":38},"action":"insert","lines":["R"],"id":1036}],[{"start":{"row":115,"column":38},"end":{"row":115,"column":39},"action":"insert","lines":["A"],"id":1037}],[{"start":{"row":115,"column":39},"end":{"row":115,"column":40},"action":"insert","lines":["P"],"id":1038}],[{"start":{"row":115,"column":40},"end":{"row":115,"column":41},"action":"insert","lines":["H"],"id":1039}],[{"start":{"row":115,"column":41},"end":{"row":116,"column":0},"action":"insert","lines":["",""],"id":1040},{"start":{"row":116,"column":0},"end":{"row":116,"column":4},"action":"insert","lines":["    "]}],[{"start":{"row":116,"column":4},"end":{"row":116,"column":5},"action":"insert","lines":["/"],"id":1041}],[{"start":{"row":116,"column":5},"end":{"row":116,"column":6},"action":"insert","lines":["/"],"id":1042}],[{"start":{"row":116,"column":6},"end":{"row":116,"column":8},"action":"insert","lines":["  "],"id":1043}],[{"start":{"row":116,"column":8},"end":{"row":116,"column":10},"action":"insert","lines":["  "],"id":1044}],[{"start":{"row":116,"column":10},"end":{"row":116,"column":12},"action":"insert","lines":["  "],"id":1045}],[{"start":{"row":116,"column":12},"end":{"row":116,"column":14},"action":"insert","lines":["  "],"id":1046}],[{"start":{"row":116,"column":14},"end":{"row":116,"column":15},"action":"insert","lines":[" "],"id":1047}]]},"ace":{"folds":[],"scrolltop":1593,"scrollleft":0,"selection":{"start":{"row":116,"column":15},"end":{"row":116,"column":15},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":98,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1473578545127}