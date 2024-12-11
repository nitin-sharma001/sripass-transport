// material-ui
import { Button, CardMedia, Link, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import avatar from 'assets/images/users/avatar-group.png';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => (
  <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
    <Stack alignItems="center" spacing={2.5}>
      <CardMedia component="img" image={avatar} sx={{ width: 112 }} />
      <Stack alignItems="center">
        <Typography variant="h5"></Typography>
        <Typography variant="h6" color="secondary">
         
        </Typography>
      </Stack>
      <AnimateButton>
        <Button component={Link}  href="#" variant="contained" color="success" size="small">
          Button
        </Button>
      </AnimateButton>
    </Stack>
  </MainCard>
);

export default NavCard;
