請參考 /Users/Shared/ccc/project/math4py/

寫一個 javascript 的 node.js 數學函式庫套件

從 math4py/statistics/ 看 math4py/plot/ 開始移植

記得先做自己的 random seed 版本的亂數，因為 javascript 不能設 seed

請規劃出 _doc/v0.1.md v0.2.md 

程式規定請按照 _doc/ccc_code_skill.md

* v0.1 - statistics/ 統計模組基礎 (Statistics Foundation)
* v0.2 - statistics/ 統計推論 (Statistical Inference)
* v0.3 - plot/ 繪圖
    * 請用現成 npm 套件，不需要和 matplotlib 一樣，但 API 盡量做得和 math4py/plot 一樣
* v0.4 - linear_algebra/ 線性代數
    * 請參考 https://github.com/sloisel/numeric/tree/master/src
    * 要包含矩陣加減乘除，以及各種分解 (eigen, SVD, QR, LU, ....) (建構在 ndarray 上)
    * https://github.com/stdlib-js/ndarray
* v0.5 - algebra/
* v0.6 - calculus/
* v0.7 - geometry/
