import axios from 'axios';


function Request(config, callback){
  let access_token = sessionStorage.getItem('access')
  let refresh_token = sessionStorage.getItem('refresh')
  if (!access_token) {
      return
  }
  else {
      config.headers = {Authorization: 'JWT ' + access_token}
      axios(config).then(callback,
        (err)=>{
          console.log(err)
        if (err.response.status === 401 && refresh_token){
          axios.post('http://localhost:8000/auth/jwt/refresh', {refresh: refresh_token}).then(
            (res)=>{
              sessionStorage.setItem('access', res.data.access)
              config.headers = {Authorization: 'JWT ' + res.data.access}
              axios(config).then(callback)
            })
          }
      })
  }
}

export default Request;
