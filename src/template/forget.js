module.exports = function(code, name, email) {
    return `
        <div style="background: #f5f5f5;">
            <div style="padding: 5rem 10rem; text-align: center; ">
                <div style="display:inline-block; width: 460px; text-align: center; background: white; padding: 4rem 5rem">
                    <p style='color: #f97029; font-size: 3rem;font-weight: bold; line-height: 2rem; margin: 0;'>
                        PolyMentor
                    </p>
                    <p style=' font-size: 1rem; font-weight: bold'>Xát thực địa chỉ email của bạn</p>
                    <p style="letter-spacing: 1px;"> Gởi ${name}, </p>
    
                    <p>Vui lòng bấm vào nút phía dưới để chuyển đến trang cập nhật mật khẩu mới</p>
                    <p>
                        <a 
                        href="https://mentor-webite.herokuapp.com/reset-password/${code}/${email}" 
                        style="margin-top: 1rem; color:white;text-decoration: none; border-radius: 3px; padding: 8px 14px; background: #f97029;">
                            Khôi phục mật khẩu
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;
};
