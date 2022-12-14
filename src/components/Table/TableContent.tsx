import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingScreen from 'components/common/LoadingScreen';
import type { FC } from 'react';

interface Props extends BoxProps {
  loading?: boolean;
  total?: number;
  noDataText?: string;
}

const TableContent: FC<Props> = (props) => {
  const { loading, total, children, noDataText, ...rest } = props;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Wrapper {...rest}>
      {total === 0 ? (
        <Box sx={{ display: 'grid', placeContent: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {noDataText || 'Không tìm thấy thông tin tìm kiếm'}
          </Typography>
        </Box>
      ) : (
        children
      )}
    </Wrapper>
  );
};

const Wrapper = styled(Box)({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

export default TableContent;
