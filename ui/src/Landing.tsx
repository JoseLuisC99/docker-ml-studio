import Stack from '@mui/material/Stack';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AnimatedPage } from './AnimatedPage';

export function Landing() {
  return (
    <>
      <AnimatedPage>
      <Stack spacing={2}>
        <Stack 
          direction="row" spacing={2} 
          display={"flex"} justifyContent={"center"} alignItems={"center"}
          style={{marginTop: '4rem', marginBottom: '2rem'}}>
          <img src='https://github.com/JoseLuisC99/Docker-autopipelines/raw/main/ui/public/logo.svg' alt='Docker autopipelines logo' height={50}></img>
          <Box textAlign={'center'}>
            <Typography variant='h1'>Docker Autopipelines</Typography>
            <Typography variant='subtitle1'>A Docker extension to run PyTorch machine learning pipelines</Typography>
          </Box>
        </Stack>
        <Box color={'text.secondary'} textAlign={'center'} style={{paddingLeft: '5rem', paddingRight: '5rem'}}>
          <Typography variant='body1' align='justify'>
            Docker AutoPipelines is your gateway to the future of machine learning. Designed to streamline the entire ML lifecycle, our Docker extension empowers users to effortlessly create, train, and deploy models with unprecedented ease. Say goodbye to coding complexities; our user-friendly interface paves the way for designing neural networks without the need for coding expertise. With just a few clicks, you can deploy your models, eliminating the hassle of traditional deployments. 
          </Typography>
          <Typography variant='body1' align='justify' style={{marginTop: '1rem'}}>
            Join the revolution in machine learning with Docker AutoPipelines and unlock the full potential of AI.
          </Typography>
          <Button style={{marginTop: '2rem'}} variant="contained" component={Link} to="/studio">
            Get started
          </Button>
        </Box>
        <Box textAlign={'center'} style={{marginTop: '4rem'}}>
          <Typography>New to Docker Autopipelines? Watch this demo to help you get started.</Typography>
          <div style={{marginTop: '1rem'}}>
            <video controls height="300">
              <source src="https://github.com/JoseLuisC99/Docker-autopipelines/raw/main/ui/public/get-started.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </Box>
      </Stack>
      </AnimatedPage>
    </>
  );
}
