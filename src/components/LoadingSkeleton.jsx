import React from 'react';

const Bone = ({ w = '100%', h = '1rem', r = '8px', style = {} }) => (
    <div className="skeleton-bone" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

const LoadingSkeleton = () => (
    <div className="skeleton-wrapper">
        {/* City name */}
        <Bone w="55%" h="2.2rem" r="10px" style={{ margin: '0 auto 0.6rem' }} />
        {/* Description */}
        <Bone w="35%" h="1rem" r="6px" style={{ margin: '0 auto 1.5rem' }} />

        {/* Icon + Temp row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <Bone w="100px" h="100px" r="50%" />
            <Bone w="90px" h="4rem" r="10px" />
        </div>

        {/* Min / Max */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <Bone w="48px" h="1rem" r="6px" />
            <Bone w="48px" h="1rem" r="6px" />
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.2rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Bone w="24px" h="24px" r="50%" />
                    <Bone w="60px" h="0.8rem" r="4px" />
                    <Bone w="40px" h="1rem" r="4px" />
                </div>
            ))}
        </div>

        {/* Sun arc placeholder */}
        <Bone w="220px" h="110px" r="12px" style={{ margin: '0 auto 0.5rem' }} />
    </div>
);

export default LoadingSkeleton;
