import { red } from '@material-ui/core/colors'

export const overrides: any = {
  MuiDialog: {
    paperWidthSm: {
      width: 550
    }
  },
  MuiDialogTitle: {
    root: {
      padding: '8px 16px'
    }
  },
  MuiDialogContent: {
    root: {
      padding: '8px 16px',
      '&:first-child': {
        paddingTop: 0
      }
    }
  },
  MuiDialogActions: {
    root: {
      padding: '8px 16px'
    }
  },
  MuiTextField: {
    root: {
      '& input': {
        padding: '5px 8px !important',
        // fontSize: 13,
        height: 14
      },
      '& textarea': {
        padding: '6px 8px !important'
        // fontSize: 13
      }
    }
  },
  MuiInputLabel: {
    outlined: {
      '&.MuiInputLabel-marginDense': {
        transform: 'translate(14px, 5px) scale(1)'
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.65)'
      }
    }
  },
  MuiTabs: {
    root: {
      marginBottom: 16
    },
    indicator: {
      background: '#0A65FF !important'
    }
  },
  MuiTab: {
    root: {
      '@media (min-width: 600px)': {
        minWidth: 100
      }
    }
  },
  MuiInputBase: {
    root: {
      padding: '0 !important',
      overflow: 'hidden',
      '& input[readonly]': {
        color: 'gray'
      },
      '& textarea[readonly]': {
        color: 'gray'
      },
      '& input[disabled]:hover': {
        cursor: 'not-allowed'
      }
    }
  },
  MuiFormLabel: {
    asterisk: {
      color: red[500]
    }
  },
  MuiSvgIcon: {
    root: {
      fontSize: '1.115rem',
      cursor: 'pointer'
    }
  },
  MuiFormControl: {
    marginNormal: {
      marginTop: 0,
      marginBottom: 0
    }
  },
  MuiDataGrid: {
    root: {
      borderRadius: 4,
      border: 'none',
      maxHeight: 'calc(100vh - 140px)',
      '& .MuiDataGrid-row.Mui-odd': {
        backgroundColor: '#F4F7FC'
      },
      '& .MuiDataGrid-row.Mui-even': {
        backgroundColor: '#ffffff'
      },
      '& .MuiDataGrid-cell': {
        // fontSize: 12
        borderBottom: 'none',
        color: '#2E3B52',
        '&:focus-within': {
          outline: 'none'
        }
      },
      '& .MuiDataGrid-colCellMoving': {
        backgroundColor: 'white'
      },
      '& .MuiDataGrid-window': {
        overflowY: 'auto !important',
        overflowX: 'hidden'
      },

      '& .MuiDataGrid-columnsContainer': {
        borderBottom: 'none',
        backgroundColor: '#F4F7FC',
        color: '#606F89',
        fontWeight: 'bold',
        lineHeight: '1.5rem'
      },
      '& .MuiDataGrid-columnSeparator': {
        color: '#F4F7FC'
      },
      '& .MuiDataGrid-colCellTitle': {
        fontWeight: 'bold'
      },
      '& .MuiDataGrid-row': {
        '&:hover': {
          backgroundColor: '#DAE1EC'
        },
        '&.Mui-selected': {
          backgroundColor: '#DAE1EC'
        }
      },
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        padding: 0
      },
      '& .MuiDataGrid-menuIcon': {
        visibility: 'visible !important'
      }
    }
  },
  MuiAccordionSummary: {
    root: {
      minHeight: 0,
      '&.Mui-expanded': {
        minHeight: 0
      }
    },
    content: {
      margin: 0,
      '&.Mui-expanded': {
        margin: 0
      }
    }
  },
  MuiSelect: {
    root: {
      fontSize: 13,
      padding: '2px 8px',
      paddingTop: 3,
      height: 20
    }
  },
  MuiTableCell: {
    root: {
      padding: '4px',
      borderBottom: 'none'
    },
    head: {
      color: '#606F89',
      fontWeight: 'bold'
    },
    body: {
      color: '#2E3B52'
    },
    stickyHeader: {
      backgroundColor: '#F4F7FC'
    }
  },
  MuiCheckbox: {
    colorPrimary: {
      '&.Mui-checked': {
        color: '#0A65FF',
        '&:hover': {
          background: 'rgb(10, 101, 255, 0.4)'
        }
      }
    }
  },
  MuiSkeleton: {
    root: {
      backgroundColor: '#DAE1EC'
    }
  }
}
