const re = /\.\/(.*)\.svg/;

const base = require.context('@/icons/svg/base', false, /\.svg$/);
const baseKeys = base.keys();
export const baseIcons = baseKeys.map(i => {
  return i.match(re)[1];
});

const brand = require.context('@/icons/svg/brand', false, /\.svg$/);
const brandKeys = brand.keys();
export const brandIcons = brandKeys.map(i => {
  return i.match(re)[1];
});
