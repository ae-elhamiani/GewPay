import React, { useEffect, useRef } from 'react';
import WhaleSVG from '../../assets/whale.svg';
import { gsap } from 'gsap';
import purple from '../../assets/purple-BG.svg';
import '../styles/whale.css'

const Whale = ({ onDotClick }) => {
    const svgRef = useRef(null);

    const handleClick = (event) => {
        const rect = event.target.getBoundingClientRect();
        onDotClick(rect.left, rect.top);
      };
      
    useEffect(() => {
        const svg = svgRef.current;
        const paths = svg.querySelectorAll('path');
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        function movePaths() {
            paths.forEach(path => {
                const rect = path.getBoundingClientRect();
                const dx = (rect.left + rect.width / 2) - mouse.x;
                const dy = (rect.top + rect.height / 2) - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                const offset = Math.min(20, 200 / dist);
                gsap.to(path, {
                    x: offset * Math.cos(angle),
                    y: offset * Math.sin(angle),
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }

        function handleMouseMove(event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            movePaths();
        }

        window.addEventListener('mousemove', handleMouseMove);

        function addGlobalWaveMotion() {
            gsap.to(svg, {
                y: '+=15',
                x: '-=5',
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }

        movePaths();
        addGlobalWaveMotion();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div style={{
            backgroundImage: `url(${purple})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }} className="absolute top-0 right-0 w-2/3 h-full">
            <img src={WhaleSVG} ref={svgRef} className="w-full h-full" />


        </div>
    )
}

export default Whale;