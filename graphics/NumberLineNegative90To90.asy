import geometry;
unitsize(1mm);
draw((-100,0)--(100,0), arrow=Arrows);
for (int i=-90; i<100; i=i+10)
{
  path tick = (0,0) -- (0,-0.05cm);
  pair p = (i,0);
  draw(p, tick);
  label(format("$%d$",i), p, S);
}
