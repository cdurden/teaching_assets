import json
from sympy import latex
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor, split_symbols
from sympy import symbols
transformations = (standard_transformations + (implicit_multiplication_application, convert_xor, split_symbols, ))
import os
import jinja2
os.chdir("/home/cld/teaching_assets/code/")
loader = jinja2.FileSystemLoader(os.path.join(os.getcwd(),"templates"))
jinja_env = jinja2.Environment(loader=loader,extensions=['jinja2.ext.with_'])
template = jinja_env.get_template("EfficientlySolvingInequalities.html")

#def latex(s):
#    s = s.replace("<=",'\le')
#    s = s.replace(">=",'\ge')
#    return(s)

def equality(s):
    s = s.replace("<=",'=')
    s = s.replace(">=",'=')
    s = s.replace(">",'=')
    s = s.replace("<",'=')
    return(s)

collection = "es1"
data ={ 
        "q67": { 'ineq': "x+5>10", 'xs': [2,3,4,5,6,7,8] },
        "q68": { 'ineq': "-x+3>=5", 'xs': [-4,-3,-2,-1,0,1,2] },
        "q69": { 'ineq': "50-2x<10", 'xs': [-30,-20,-10,0,10,20,30] },
        "q70": { 'ineq': "2x+4<8", 'xs': [-2,-1,0,1,2,3,4] },
        "q71": { 'ineq': "5-2x<=1", 'xs': [-2,-1,0,1,2,3,4] },
        "q72": { 'ineq': "4-2x<0", 'xs': [-2,-1,0,1,2,3,4] },
        "q73": { 'ineq': "2x-8>4", 'xs': [-2,-1,0,1,2,3,4] },
        "q74": { 'ineq': "2x-8>25", 'xs': [-30,-20,-10,0,10,20,30] },
        "q75": { 'ineq': "-3x-10>-40", 'xs': [-30,-20,-10,0,10,20,30] },
        }
x = symbols("x")
no = 0
for task,ex in data.items():
    no = no+1
    csv = ''
    ineq = parse_expr(ex['ineq'])
    variable = 'x'
    lhs = ineq.lhs
    csv += "${:s}$,${:s}$,<div class='sm-font'>Solution or not a solution?</div>\n".format(variable, latex(lhs))
    for x0 in ex['xs']:
        solution = parse_expr(ineq,transformations=transformations).subs(x,parse_expr(str(x0)))
        csv += "{:d},[{:s}],{:s}\n".format(x0,lhs.subs(x,parse_expr(str(x0))),"[Solution]" if solution else "[Not a solution]")
    ex['csv'] = csv
    ex.update({
      "class": "CompleteTableDraggableQuestion",
      "Question": "Complete the table to identify solutions to {:s}".format(latex(ineq)),
      "transpose_display": "True",
      "blocks":["Solution","Not a solution"],
      "render_blocks": 0,
      "dropzone": range(len(ex['xs'])+1,2*len(ex['xs'])+1),
      "block_container": "inequalities_q{:d}_block_container"})
    ex0 = ex
    ex0.update({
      "latex": latex(ineq),
      "collection": collection,
      "task": task,
      "no": no,
      "equality": equality(ex['ineq']),
      "variable": variable,
    })
    html = template.render(**ex0)
    with open(os.path.join("out","Exercise{:d}.html".format(no)),"w") as f:
        f.write(html)

with open(os.path.join("out","{:s}.json".format(collection)),"w") as f:
    f.write(json.dumps(data))




