module.exports = function(code, name) {
    return `

    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
     
<div style="background: #f5f5f5;">
<div style="padding: 5rem 10rem; text-align: center; ">
    <div style="display:inline-block; width: 460px; text-align: center; background: white; padding: 4rem 5rem">
        <p style='color: #f97029; font-size: 3rem;font-weight: bold; line-height: 2rem; margin: 0;'>
            PolyMentor
        </p>
        <p style=' font-size: 1rem; font-weight: bold'>Xát thực địa chỉ email của bạn</p>
        <p style="letter-spacing: 1px;"> Gởi ${name}, </p>

        <p>PolyMentor rất vui khi bạn tham gia vào cộng đồng sinh viên PolyMentor. Ấn vào nút phía dưới để xác thực tài khoản.</p>
        <p style="box-shadow: 0px 0px 16px rgba(0,0,0,.07); padding:6px 10px; border-radius: 3px ">
        
        <a 
        href="https://mentor-webite.herokuapp.com/verify-success/${code}" 
        style="margin-top: 1rem; color:white;text-decoration: none; border-radius: 3px; padding: 8px 14px; background: #f97029;">
            Xác thực tài khoản
        </a>
        </p>
    </div>
</div>
</div>
</body>

</html>
    `;
};
