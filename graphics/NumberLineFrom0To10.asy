import geometry;
unitsize(3.75mm);
draw((-1,0)--(11,0), arrow=Arrows);
for (int i=0; i<11; i=i+1)
{
  path tick = (0,0) -- (0,-0.05cm);
  pair p = (i,0);
  draw(p, tick);
  label(format("$%d$",i), p, S);
}
