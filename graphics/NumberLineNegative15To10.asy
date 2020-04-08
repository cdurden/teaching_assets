import geometry;
unitsize(2.5mm);
draw((-20,0)--(15,0), arrow=Arrows);
for (int i=-15; i<15; i=i+5)
{
  path tick = (0,0) -- (0,-0.05cm);
  pair p = (i,0);
  draw(p, tick);
  label(format("$%d$",i), p, S);
}
