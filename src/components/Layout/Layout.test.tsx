import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Layout, LayoutHeader, LayoutWrapper } from './Layout';

test('Component Layout to be rendered', () => {
  render(
    <Layout>
      <LayoutHeader title="Hello" />
      <LayoutWrapper>
        <div>World</div>
      </LayoutWrapper>
    </Layout>,
  );
  const layout = screen.getByTestId('layout');
  expect(layout).toBeInTheDocument();
  expect(layout).toHaveTextContent('World');

  const layoutWrapper = screen.getByTestId('layout-wrapper');
  expect(layoutWrapper).toHaveClass('max-w-screen-xl');
});
