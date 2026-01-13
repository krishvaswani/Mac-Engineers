import { useEffect, useRef } from "react";
import gsap from "gsap";
import logo from "../Assets/logo.png";

export default function Preloader({ onFinish }) {
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onFinish,
    });

    tl.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    )
      .to(logoRef.current, {
        rotate: 360,
        duration: 1.2,
        ease: "power2.inOut",
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
      });
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black"
    >
      <img
        ref={logoRef}
        src={logo}
        alt="Loading"
        className="w-20 h-20"
      />
    </div>
  );
}
