module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme:{
    container:{
      center:true,
      padding:"1.5rem"
    },
    screens:{
      sm:{min:"540px", max:"767px"}
    }
  }
};