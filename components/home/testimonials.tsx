"use client";

import { AnimatedTestimonials } from "@/components/animated-testimonials"

export function AnimatedTestimonialsBasic() {
  return (
    <AnimatedTestimonials
      className="relative z-20 bg-[#0A0A0A]"
      testimonials={[
        {
          id: 1,
          name: "Shanne Quitlong",
          role: "Mother",
          company: "Philippines",
          content:
            "Having the robot at home completely changed how we manage daily chores. It handles tasks efficiently and blends naturally into our routine without feeling intrusive.",
          rating: 5,
          avatar: "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777642440/copy_of_img_1312_mt34zc_caaba1.jpg",
        },
        {
          id: 2,
          name: "Simsim Quitlong",
          role: "Cat",
          company: "Kuwait",
          content:
            "I was surprised by how reliable it is. From cleaning to small assistance tasks, it consistently performs well and saves us so much time every day.",
          rating: 5,
          avatar: "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777642701/6314510242443629373_tn9qlo.jpg",
        },
        {
          id: 3,
          name: "Nugget Balquen",
          role: "Dog",
          company: "Singapore",
          content:
            "It feels like having an extra helping hand at home. Everything runs smoother, and it genuinely reduces the stress of household work.",
          rating: 5,
          avatar: "https://res.cloudinary.com/dcmj7quyv/image/upload/v1777642331/copy_of_img_8052_ippjuv_58d4aa.jpg",
        },
      ]}
      trustedCompanies={["Google", "Microsoft", "Airbnb", "Spotify", "Netflix"]}
    />
  );
}
