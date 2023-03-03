import { Box, Typography } from '@material-ui/core'
import { TABLE_HEIGHT } from '@/styles/vars/size'

function MalisNoViewPermissionOnModule() {
  return (
    <Box height={TABLE_HEIGHT} display="flex" alignItems="center" justifyContent="center" textAlign="center">
      <Typography variant="h6" gutterBottom>
        You don&rsquo;t have permission to view this topic, please contact your administrator for more information.
      </Typography>
    </Box>
  )
}

export default MalisNoViewPermissionOnModule
