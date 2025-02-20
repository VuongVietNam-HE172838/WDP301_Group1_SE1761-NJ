import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const About = () => {
    return (
        <div>
            <header className="hero mt-5">
                <div className="hero-overlay"></div>
                <div className="hero-content text-center">
                    <h1 className="display-4 fw-bold text-danger">Food Trip</h1>
                    <p className="lead">Ăn ngon - Đặt tiện</p>
                </div>
            </header>

            <section className="about-section container text-center py-5">
                <h2 className="mb-4">About Us</h2>
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <img src="https://st5.depositphotos.com/67903508/65361/i/450/depositphotos_653610812-stock-photo-vertical-shot-empty-restaurant-table.jpg" alt="Restaurant Interior" className="about-img img-fluid rounded" style={{width:"600px", height:"800px"}}/>
                    </div>
                    <div className="col-md-6 text-start">
                        <h3 className='text-danger'>Welcome to Food Trip</h3>
                        <p>
                            Chào mừng bạn đến với Food Trip, nơi hội tụ tinh hoa ẩm thực và trải nghiệm ẩm thực tuyệt vời nhất! Chúng tôi tự hào mang đến cho thực khách những món ăn ngon miệng, được chế biến từ nguyên liệu tươi ngon nhất và công thức độc đáo của các đầu bếp tài hoa.
                        </p>
                        <h3 className='text-danger'>Sứ Mệnh Của Chúng Tôi</h3>
                        <p>
                            Chúng tôi không chỉ phục vụ các món ăn ngon mà còn mong muốn mang đến trải nghiệm ẩm thực trọn vẹn, nơi mỗi bữa ăn không chỉ là thưởng thức mà còn là sự tận hưởng. Từ không gian ấm cúng của nhà hàng cho đến dịch vụ giao hàng nhanh chóng, tiện lợi, chúng tôi cam kết mang đến sự hài lòng cho mọi khách hàng.
                        </p>
                        <h3 className='text-danger'>Web App Đặt Đồ Ăn Tiện Lợi</h3>
                        <p>
                        Nhằm giúp khách hàng có trải nghiệm tốt nhất, chúng tôi phát triển web app đặt đồ ăn trực tuyến với giao diện thân thiện, dễ sử dụng. Bạn có thể dễ dàng:
                        </p>
                        <ul>
                            <li>Xem thực đơn chi tiết với hình ảnh sắc nét.</li>
                            <li>Đặt món nhanh chóng chỉ với vài cú nhấp chuột.</li>
                            <li>Theo dõi trạng thái đơn hàng theo thời gian thực.</li>
                            <li>Thanh toán an toàn, đảm bảo</li>
                        </ul>
                        <h3 className='text-danger'>Cam Kết Của Chúng Tôi</h3>
                        <p>
                        Nhằm giúp khách hàng có trải nghiệm tốt nhất, chúng tôi phát triển web app đặt đồ ăn trực tuyến với giao diện thân thiện, dễ sử dụng. Bạn có thể dễ dàng:
                        </p>
                        <ul>
                            <li>Chất lượng hàng đầu: Luôn sử dụng nguyên liệu tươi sạch và an toàn.</li>
                            <li>Dịch vụ tận tâm: Phục vụ chuyên nghiệp, nhiệt tình.</li>
                            <li>Công nghệ hiện đại: Đặt món dễ dàng, giao hàng nhanh chóng.</li>
                        </ul>
                        <p>
                        Hãy cùng chúng tôi trải nghiệm ẩm thực tuyệt vời tại Food Trip hoặc đặt món ngay trên web app của chúng tôi để tận hưởng những bữa ăn ngon một cách nhanh chóng!
                        </p>
                        <p className="fw-bold text-danger">Since: <span className="text-dark">2025 - Now</span></p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
