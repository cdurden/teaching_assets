import geometry;
unitsize(1mm);
draw((-10,0)--(110,0), arrow=Arrows);
for (int i=0; i<110; i=i+10)
{
  path tick = (0,0) -- (0,-0.05cm);
  pair p = (i,0);
  draw(p, tick);
  label(format("$%d$",i), p, S);
}
