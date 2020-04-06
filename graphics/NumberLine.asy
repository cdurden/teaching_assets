import geometry;
unitsize(1mm);
draw(({{ min }},0)--({{ max }},0), arrow=Arrows);
for (int i={{ min }}; i<{{ max }}; i=i+{{step}})
{
  path tick = (0,0) -- (0,-0.05cm);
  pair p = (i,0);
  draw(p, tick);
  label(format("$%d$",i), p, S);
}
