# p5 Houseplants
PSX styled, low poly houseplant generator in p5.js

## Background and purpose
I wanted to make some PSX styled houseplant models. Inspired by
CodingTrain videos and especially the winter snowperson livestream,
I decided to make a generator in p5. I'd guess that usually the
aliasing of the default WEBGL mode is not welcomed - but here it makes
my plants so much more PSX-y!
There is absolutely no fancy optimization, the script simply generates
the vertices the same way I would model them by hand. Over time, the
sketch became more complex than I expected, but the result is
pretty satisfying.
Additionaly, what started as a debug helper, became a "save & load"
feature - you can encode, save and load the parameters of a generated
plant.

## How it's made
Made with p5.js

## Concluding remarks
The geometry part works mostly as intended but I can't grasp the issue
with the leaf UVs stretching and warping. Still, texture warping makes
the leaves more organic, so its OK.
If I ever come back to this project, I'll probably add some sliders
to control the instance parameters in real time. OBJ file exporter
would also be a nice feature, although I think that rewriting everything
as a python script for blender would be far easier and faster.
Code & assets licensed MIT.
