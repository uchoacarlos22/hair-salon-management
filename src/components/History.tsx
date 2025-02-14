import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  TablePagination,
  Backdrop,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  usePerformedServices,
  ServiceWithDetails,
} from '../hooks/usePerformedServices';
import { fetchProfessionals } from '../services/professionalsService';
import { servicesService } from '../services/servicesService';
import { SelectChangeEvent } from '@mui/material/Select';

interface Professional {
  user_id: string;
  name: string;
}

interface AvailableService {
  service_id: string;
  name: string;
}

export const History: React.FC = () => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));

  // Filter states
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    null,
  );
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [availableServices, setAvailableServices] = useState<
    AvailableService[]
  >([]);

  useEffect(() => {
    const fetchProfessionalsData = async () => {
      const professionalsData = await fetchProfessionals();
      const validProfessionals = professionalsData
        .filter((user) => user.user_id !== undefined)
        .map((user) => ({
          user_id: user.user_id!,
          name: user.name,
        }));
      setProfessionals(validProfessionals);
    };

    const fetchServices = async () => {
      const servicesData = await servicesService.fetchServices();
      setAvailableServices(servicesData);
    };

    fetchProfessionalsData();
    fetchServices();
  }, []);

  const {
    services,
    servicesMap,
    productsMap,
    loading,
    error,
    setStartDate: setHookStartDate,
    setEndDate: setHookEndDate,
    setProfessionalId: setHookProfessionalId,
    setServiceType: setHookServiceType,
  } = usePerformedServices();

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
    setHookStartDate(event.target.value);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
    setHookEndDate(event.target.value);
  };

  const handleServiceTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedServiceType(event.target.value);
    setHookServiceType(event.target.value);
  };

  const handleProfessionalChange = (event: SelectChangeEvent<string>) => {
    setProfessionalId(event.target.value);
    setHookProfessionalId(event.target.value);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setProfessionalId(null);
    setSelectedServiceType(null);
    setHookStartDate(undefined);
    setHookEndDate(undefined);
    setHookProfessionalId(undefined);
    setHookServiceType(undefined);
  };

  const [selectedService, setSelectedService] =
    useState<ServiceWithDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

 // Retorna o tipo do serviço para exibição
  const getServiceType = (service: ServiceWithDetails) => {
    if (service.service?.length > 0 && service.products_sold?.length > 0) {
      return 'Serviço e Produto';
    } else if (service.service?.length > 0) {
      return 'Serviço';
    } else if (service.products_sold?.length > 0) {
      return 'Produto';
    }
    return '';
  };

  const handleOpenDetails = (service: ServiceWithDetails) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Calculates the items to be displayed on the current page
  const currentPageServices = services.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography
          sx={{
            color: 'white',
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          Carregando...
        </Typography>
      </Backdrop>

      {/* Main Content */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 0,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            mb: 1,
            px: 1,
          }}
        >
          Histórico de Serviços
        </Typography>

        {/* Filter Section */}
        <Box
          sx={{
            width: { xs: '100%', md: '95%' },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            label="Data Inicial"
            type="date"
            value={startDate || ''}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: { xs: '100%', sm: '150px' } }}
          />
          <TextField
            label="Data Final"
            type="date"
            value={endDate || ''}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: { xs: '100%', sm: '150px' } }}
          />
          <FormControl sx={{ width: { xs: '100%', sm: '150px' } }}>
            <InputLabel id="service-type-label">Tipo de Serviço</InputLabel>
            <Select
              labelId="service-type-label"
              value={selectedServiceType || ''}
              onChange={handleServiceTypeChange}
              label="Tipo de Serviço"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Serviço">Serviço</MenuItem>
              <MenuItem value="Produto">Produto</MenuItem>
              <MenuItem value="Serviço e Produto">Serviço e Produto</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: { xs: '100%', sm: '150px' } }}>
            <InputLabel id="professional-label">Profissional</InputLabel>
            <Select
              labelId="professional-label"
              value={professionalId || ''}
              onChange={handleProfessionalChange}
              label="Profissional"
            >
              <MenuItem value="">Todos</MenuItem>
              {professionals.map((professional) => (
                <MenuItem
                  key={professional.user_id}
                  value={professional.user_id}
                >
                  {professional.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleClearFilters}
            sx={{ width: { xs: '100%', sm: '200px' } }}
          >
            Limpar Filtros
          </Button>
        </Box>

        {/* Service List */}
        <Box
          component={Paper}
          sx={{
            width: { xs: '100%', md: '95%' },
            borderRadius: 0,
            overflow: 'hidden',
            mt: 1,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              p: 1,
              borderBottom: '1px solid #eee',
              bgcolor: '#f5f5f5',
            }}
          >
            <Typography
              sx={{
                width: { xs: '40%', md: '20%' },
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Data
            </Typography>
            {!isCompact && (
              <Typography
                sx={{
                  width: { xs: '25%', md: '20%' },
                  fontWeight: 500,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Tipo
              </Typography>
            )}

            {!isCompact && (
              <>
                <Typography
                  sx={{
                    width: { xs: '25%', md: '25%' },
                    flex: 1,
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  Profissional
                </Typography>
              </>
            )}

            <Typography
              sx={{
                width: { xs: '30%', md: '15%' },
                textAlign: 'left',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Valor
            </Typography>

            <Typography
              sx={{
                width: { xs: '30%', md: '20%' },
                textAlign: 'center',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Detalhes
            </Typography>
          </Box>

          {/* List of items on the current page */}
          {currentPageServices.map((service) => (
            <Box
              key={service.performed_id}
              sx={{
                display: 'flex',
                p: 1,
                borderBottom: '1px solid #eee',
                '&:last-child': { borderBottom: 'none' },
                alignItems: 'center',
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography
                sx={{
                  width: { xs: '40%', md: '20%' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.primary',
                }}
              >
                {new Date(service.created_at!).toLocaleDateString('pt-BR')}
              </Typography>
              {!isCompact && (
                <Box sx={{ width: { xs: '25%', md: '20%' } }}>
                  <Chip
                    label={getServiceType(service)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.875rem' }}
                  />
                </Box>
              )}

              {!isCompact && (
                <Typography
                  sx={{
                    width: { xs: '25%', md: '25%' },
                    flex: 1,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: 'text.primary',
                  }}
                >
                  {service.users_table?.name}
                </Typography>
              )}

              <Typography
                sx={{
                  width: { xs: '30%', md: '15%' },
                  textAlign: 'left',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                R$ {service.total.toFixed(2)}
              </Typography>

              <Box
                sx={{
                  width: { xs: '30%', md: '20%' },
                  textAlign: 'center',
                }}
              >
                <Button
                  variant="text"
                  size="small"
                  onClick={() => handleOpenDetails(service)}
                  sx={{
                    minWidth: 'auto',
                    color: 'primary.main',
                    px: 1,
                  }}
                >
                  Ver
                </Button>
              </Box>
            </Box>
          ))}

          {/* Pagination */}
          <TablePagination
            component="div"
            count={services.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]} // Fixed at 5 items per page
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            labelRowsPerPage="" // Removes the text "Rows per page"
            sx={{
              borderTop: '1px solid #eee',
            }}
          />
        </Box>

        {/* Details Modal */}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-title"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '450px' },
              maxHeight: { xs: '80vh', sm: '90vh' },
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: { xs: 2, sm: 3 },
              borderRadius: 1,
              overflow: 'auto',
            }}
          >
            {selectedService && (
              <>
                {/* Close Button */}
                <IconButton
                  onClick={() => setModalOpen(false)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'text.secondary',
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    mb: 2,
                    pb: 1,
                    borderBottom: '1px solid #eee',
                    pr: 4, // Space for the close button
                  }}
                >
                  Detalhes do Serviço
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    mb: 2,
                  }}
                >
                  Data:{' '}
                  {new Date(selectedService.created_at!).toLocaleDateString(
                    'pt-BR',
                  )}
                </Typography>

                {selectedService.service?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      Serviços:
                    </Typography>
                    {selectedService.service.map((s, index) => {
                      const serviceData = servicesMap.get(s.service_id);
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 0.5,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {serviceData?.name} - {s.quantity}x
                          </Typography>
                          <Typography
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            R$ {(s.value * s.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                {selectedService.products_sold?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      Produtos:
                    </Typography>
                    {selectedService.products_sold.map((p, index) => {
                      const productData = productsMap.get(p.product_id);
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            py: 0.5,
                          }}
                        >
                          <Typography
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {productData?.name} - {p.quantity}x
                          </Typography>
                          <Typography
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            R$ {(p.value * p.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}

                <Typography
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: 'text.secondary',
                  }}
                >
                  {selectedService.observations || 'Nenhuma observação'}
                </Typography>

                <Box
                  sx={{
                    pt: 2,
                    mt: 2,
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      fontWeight: 500,
                    }}
                  >
                    Total:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '1.1rem', sm: '1.25rem' },
                      fontWeight: 500,
                    }}
                  >
                    R$ {selectedService.total.toFixed(2)}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default History;
