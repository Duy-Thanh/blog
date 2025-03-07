import styled from 'styled-components';

export const ResponsiveImage = styled.img`
  max-width: 100%;
  height: auto;
  object-fit: cover;
  aspect-ratio: 16/9;
`;

// Optional: Create a variant with different aspect ratio
export const SquareResponsiveImage = styled(ResponsiveImage)`
  aspect-ratio: 1/1;
`;

// Optional: Create a variant for profile images
export const ProfileImage = styled(ResponsiveImage)`
  aspect-ratio: 1/1;
  border-radius: 50%;
`; 