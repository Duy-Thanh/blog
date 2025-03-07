import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  
  @media screen and (max-width: 768px) {
    padding: 16px;
  }
  
  @media screen and (max-width: 480px) {
    padding: 12px;
  }
`;

function Layout() {
  useEffect(() => {
    document.querySelector('meta[name="viewport"]').setAttribute(
      'content',
      'width=device-width, initial-scale=1.0'
    );
  }, []);

  return (
    <LayoutContainer>
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout; 