import { Box, Stack, Typography } from "@mui/material";
import { AnimatedPage } from "./AnimatedPage";

export function MainStudio() {
    return (
        <>
        <AnimatedPage>
        <Stack spacing={2}>
            <Box textAlign={'center'}>
            <Typography variant='h2'>Docker Autopipelines</Typography>
            <Typography variant="subtitle1">Studio</Typography>
            </Box>
        </Stack>
        </AnimatedPage>
        </>
    )
}