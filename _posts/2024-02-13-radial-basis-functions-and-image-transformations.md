---
layout: post
title: "Radial Basis And Image Transformations"
date: 2025-02-13
categories: ["machine-learning", "basics", "computer-vision"]
---

## Problem Statement

I was recently working on a problem involving computer vision on Rubik's cubes. One of the things that I was interested in was detecting the current state of a Rubik's cube during inspection. One of the features of a Rubik's cube is that it has the 24 rotational symmetries of Cube. These rotational symmetries are frequently exploited in solution software, as turning the right face of the cube clockwise is the same as rotating the cube and turning the left face clockwise (and then rotating back). They're also exploited during the fewest moves event, as rotating the cube before you scramble can give you a new perspective (and for the more advanced, inverse scrambles exploit more group symmetries).

If you scramble a cube holding the WCA starting orientation (white or lightest color on top, and green on front), then any solution to the cube from this state is the same as if you scrambled the cube from a different orientation. The solution will work for both cubes. If you're unfamiliar with Rubik's cubes, spend some time rotating the cubes around to get a sense of how colors relative to each other remain fixed during rotations. You can see how different starting orientations preserve the "state" of the cube while changing the colors of the pieces (edges and corners). Verify this below after clicking the rewind buttons:

[Cube 1](https://alg.cubing.net/?setup=F2_D_U-_B2_D-_R2_D_L2_F_U_B2_D-_F_D-_R2_D2_L&alg=z2_y_%2F%2F_inspection%0AU_r_U-_r-_U_D-_F_D-_D_F_D-_U-_R2_U_R-_D_%2F%2F_xxcross%0Ay_R_U-_R-_%2F%2F_3rd_pair%0Ay_R_U-_R-_U_R_U-_R-_U_R_U-_R-_%2F%2F_4th_pair%0AU_F_R-_F-_R_U_R_U-_R-_%2F%2F_EO%0AR-_R_U2-_R_U_R-_U_R_U2-_R2-_U-_R_U-_R-_U2_R_%2F%2F_ZBLL)
[Cube 2](https://alg.cubing.net/?setup=x_y_F2_D_U-_B2_D-_R2_D_L2_F_U_B2_D-_F_D-_R2_D2_L&alg=z2_y_%2F%2F_inspection%0AU_r_U-_r-_U_D-_F_D-_D_F_D-_U-_R2_U_R-_D_%2F%2F_xxcross%0Ay_R_U-_R-_%2F%2F_3rd_pair%0Ay_R_U-_R-_U_R_U-_R-_U_R_U-_R-_%2F%2F_4th_pair%0AU_F_R-_F-_R_U_R_U-_R-_%2F%2F_EO%0AR-_R_U2-_R_U_R-_U_R_U2-_R2-_U-_R_U-_R-_U2_R_%2F%2F_ZBLL)

However, you might notice that the presentation of the cube is different, as in the stickers look different -- as if the stickers themselves have been swapped with each other.

### Hypothetical:

You are interested in building a computer vision model that takes a short video of someone rotating a cube around and produces the current state of the cube (which is typically fed into a solver to tell you what to do). We could try classical computer vision techniques, something might be: line detection, pull out the 3x3 regions, K-means cluster the pixel values and then fill in the side on the software side. This approach works (and there are a number of phone apps that let you do this), but it is not a robust solution to how cubers solve cubes.

Instead, we need a more robust solution. And deep learning solutions are far more data hungry than classical techniques. We need a way to augment our data so that we get a lot more cube states to work with (and way, way more bang for our data-buck). As every clip of our dataset, will now give us 24 times more data to train on, and 24 more cube states to predict.

### I just peel the stickers off

Ideally, we could go back in time, and rotate the cube before the scramble to get a different cube state. Instead, we can do the visual equivalent of peeling the stickers off. Rotating the color space so green is where white used to be is the same as peeling off all the green stickers and replacing the white stickers with them... and place the white stickers where they should go, and so on. That's a permutation of colors in color space, and a rotation in Rubik's space.

There's already a common transformation that permutes colors... it's a linear transformation of the RGB color channels, changing RGB into BGR by just swapping red and blue color channels. Then graphing it as if it was an RGB image swaps all the red colors to blue, and all blue to red. But it also has side effects that yellow (100% red, 100% green, 0% blue) becomes a teal color instead. This is all to say, that linear transformations have large side effects. We can try to construct a linear transformation of the 6 colors of a cube to permute them. But it's simply not possible, we're garunteed to have lots of side effects. This is because lots of the colors are co-linear in color space (as in some are close to each other along the same line).

- [1, 1, 1] = White
- [1, 0, 0] = Red
- [0, 1, 0] = Green
- [1, 1, 0] = Yellow
- [1, 0.65, 0] = Orange
- [0, 0, 1] = Blue

For any linear transform of Yellow to Green, the color orange must be blue; however, in the linear transform, it will be closer to Green than it is to orange. 

## Radial Basis Functions

What we need, is some non-linear function that is sufficiently smooth, at the very least, continuous, to permute these colors with each other. We don't know what the function is, but we know what we are trying to achieve ([1,1,1] becomes [1,0,0], etc, etc for all the colors). So, we're now left with a non-linear approximation problem. 

In Real Analysis, or maybe Functional Analysis, the space of infinitely differentiable functions on some compact set, forms a vector space. Every vector space has some basis (a way to write any vector/function in the space as a linear combination of that basis) -- and Radial Basis functions (they typically have some constraints) are the basis for many function spaces. The very famous fourier transformation is a basis for function space. In fact, sine and cosine, due to their smoothness, continuity, and well-behaved nature in differentiation, make great candidates for a radial basis.

You may recognize some of these radial basis functions if you're familiar with non-linear kernels for support vector classifiers. In the same way that we utilize the "kernel trick" in SVMs (utilizing an inner product to get past linear classifiers), we utilize the distance between our points to "bump" our color space into different shapes.

### The core idea:

At the heart of RBFs is the idea of using a set of "basis functions", for the gaussian it's $\phi _i(r) = e^{-(\frac x \epsilon)^2}$, to approximate our target non-linear function, we have a weighted sum of our RBFs, $f(x) = w_1 \phi _1(x) + w_2 \phi _2(x) \ldots$, where the value of each function at a given point depends only on the distance between that point and a fixed center. Think of it like placing a series of "bumps" or "waves" in your data space, each centered at one of your known data points. The shape and influence of these bumps are determined by the chosen RBF.

### The goal is Interpolation

For each of our input colors (let's call them $c_1​,c_2​,...,c_n$​), we create an RBF centered at that color. So, if we have 6 input colors, we'll have 6 RBFs, each centered at one of them. Then, for an arbitrary color x (which could be a pixel in our image), the i-th basis function will have a value of $ \phi (\lvert x−c_i ​\rvert )$ .
Here, $ \lvert x−c_i\rvert $ is the Euclidean distance between the color x and the i-th input color $c_i$​ in the RGB space.

### Finding the Weights: Solving a Linear System

The crucial step is determining the values of these weights $w_i$​. We do this by using the fact that we know the desired output for each of our input colors. For each input color $c_j$​, we want our function $f(c_j​)$ to be equal to the corresponding target color $c_j′$​. This gives us a system of linear equations:

For $j=1,2,...,n$:

$ f(c_j​)=\sum _{i=1}^n ​w_i​ \phi(\lvert c_j​−c_i​ \rvert)=c_j′​ $

This is a system of n vector equations (or 3n scalar equations, since our colors are 3D RGB vectors) with n unknown weight vectors w_i​ (each also 3D). We can set this up in matrix form as $AW=C′$, where:

- $A$ is an n×n matrix where the element at row j and column i is $\phi(\lvert c_j​−c_i​ \rvert)$. This matrix depends only on the distances between our input colors and the chosen RBF.
- $W$ is an n×3 matrix where the i-th row is the transpose of the weight vector $w_i$​.
- $C′$ is an n×3 matrix where the j-th row is the transpose of the target color $c_j′$​.

We solve this linear system for $W$ (i.e., find the weights wi​). If the matrix $A$ is invertible, we can find a unique set of weights. And as it turns out, for certain RBF's the matrix $A$ is **always** invertible. For the mathematically inclined, but those who didn't take functional analysis, I ask you to ponder what this implies about our choice of functions as a basis for function space.

### The Role of the Shape Parameter ($\epsilon$)

Some RBFs, like Gaussian and Multiquadric, have a shape parameter $\epsilon$. This parameter controls how "wide" or "flat" the basis function is.

A smaller $\epsilon$ in a Gaussian makes it more peaked and localized, meaning it has a strong influence only in a small region around its center. Contrastively, a larger $\epsilon$ makes it flatter and gives it a broader influence.

The choice of $\epsilon$ can significantly affect the resulting interpolation. A poorly chosen $\epsilon$ might lead to overfitting (fitting the data too closely, including noise) or undersmoothing (not capturing the underlying trend). Finding a good value for $\epsilon$ often involves some experimentation or using more advanced techniques like cross-validation.  

However, for our purposes we are TRYING to perfectly fit our data so the colors are permuted. In a sense, a linear transformation underfits our 6 point dataset.

### The Finale: Making Predictions (Transforming New Colors)

Once we have determined the weights w_i​, we can use our function $f(x​)=\sum _{i=1}^n ​w_i​ \phi(\lvert x​−c_i​\rvert)​$ to transform any new color x (like the RGB value of a pixel in an image). For this new color x, we calculate its distance to each of our input colors $c_i$​, evaluate the RBF at these distances, and then take the weighted sum using the weights we found. This gives us the transformed color f(x).

### Bonus Content:

It's useful to pick fixed points in our data to make sure that after the transformation, our points are still the same, such as the color black so that those colors don't get distorted too much.

It's also useful to understand how much your RBF transforms colors far away, as the resulting RGB cube is no longer a cube and some weird bumpy blob, and you could end up sending some colors far-far away which will end up getting clipped off. This results in weird visual peculiarities, where (say purples) can result in a maximally oversaturated yellowish-green. Usually oversaturation in an image appears as everything is white-ish (as all the colors are closer to white than black), so it's kind of fun to see an image become oversaturated with peculiar colors. You can see how oversaturated parts of the photo become heavily saturated with our new color.

## Color Permutation in Action:

The results are way too cool to not share! So I made this little widget to see all possible orientations of a Rubik's Cube... as a color transformation on your images. It's kind of fun to upload a picture of my [Mom's artwork](https://evelyngallery.art/en/) and swap the colors around.

The baseline, WCA canonical orientation is UF with white on top and green on front. The letters represent: 
- U(p) ⬜ <span style="color:#FFFFFF; background-color:#333">White</span>
- <span style="color:red">R(ight) 🟥 Red</span>
- <span style="color:green">F(ront) 🟩 Green</span>
- <span style="color:orange">L(eft) 🟧 Orange</span>
- <span style="color:yellow; background-color:#333">D(own) 🟨 Yellow</span>
- <span style="color:blue">B(ack) 🟦 Blue</span>

The two letter pairs represent sending those sides to <span style="color:#FFFFFF; background-color:#333">U</span><span style="color:green">F</span> location, so <span style="color:blue">B</span><span style="color:red">R</span> represents replacing UP Front colors with <span style="color:blue">Back</span> color and <span style="color:red">Right</span>. Basically, <span style="color:#FFFFFF; background-color:#333">U</span><span style="color:green">F</span> becomes <span style="color:blue">U</span><span style="color:red">F</span>. It's not the most convenient, but programmatically, I generated the symmetries and this notation made it a lot easier to also generate all possible rotations. And I made the table right from the innards of the program.

{% include scripts/radial_basis/radial_color.html %}