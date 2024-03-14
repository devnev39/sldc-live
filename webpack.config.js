// webpack.config.js
export const test = /\.svg(\?v=\d+\.\d+\.\d+)?$/;
export const use = [
  {
    loader: "babel-loader",
  },
  {
    loader: "@svgr/webpack",
    options: {
      babel: false,
      icon: true,
    },
  },
];
