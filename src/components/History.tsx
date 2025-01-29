import React, { useEffect, useState } from 'react';
import { performedServicesService } from '../services/performedServicesService';
import { servicesService } from '../services/servicesService';
import { productsService } from '../services/productsService';
import { supabase } from '../services/supabaseClient';
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
    } from '@mui/material';
import { PerformedService } from '../types/performedServices';
import { Service } from '../types/services';
import { Product } from '../types/products';
import { Close as CloseIcon } from '@mui/icons-material';

interface ServiceWithDetails extends PerformedService {
  serviceDetails?: Map<string, Service>;
  productDetails?: Map<string, Product>;
}

export const History: React.FC = () => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));

  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [servicesMap, setServicesMap] = useState<Map<string, Service>>(
    new Map(),
  );
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] =
    useState<ServiceWithDetails | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

      useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Carregar serviços e produtos para referência
      const [servicesData, productsData, performedServices] = await Promise.all(
        [
          servicesService.fetchServices(),
          productsService.fetchProducts(),
          performedServicesService.fetchPerformedServices(user.id),
        ],
      );

      // Criar maps para lookup rápido
      const sMap = new Map(servicesData.map((s) => [s.service_id, s]));
      const pMap = new Map(productsData.map((p) => [p.product_id, p]));

      setServicesMap(sMap);
      setProductsMap(pMap);
      setServices(performedServices);
          } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatServiceItem = (serviceItem: any) => {
    const service = servicesMap.get(serviceItem.service_id);
    return service ? `${serviceItem.quantity}x ${service.title}` : '';
  };

  const formatProductItem = (productItem: any) => {
    const product = productsMap.get(productItem.product_id);
    return product ? `${productItem.quantity}x ${product.name}` : '';
  };

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

  // Calcula os itens que devem ser mostrados na página atual
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
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ 
          color: 'white',
          fontSize: { xs: '1rem', sm: '1.1rem' }
        }}>
          Carregando...
        </Typography>
      </Backdrop>

      {/* Conteúdo principal */}
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

        {/* Lista de Serviços */}
        <Box
          component={Paper}
          sx={{
            width: {
              xs: '100%',
              md: '95%',
            },
            borderRadius: 0,
            overflow: 'hidden',
            mt: 1,
          }}
        >
          {/* Cabeçalho */}
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
                width: { xs: '40%', md: '30%' },
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Data
            </Typography>

            {!isCompact && (
              <Typography
                sx={{
                  width: '30%',
                  flex: 1,
                  fontWeight: 500,
                  fontSize: '1rem',
                }}
              >
                Tipo
              </Typography>
            )}

            <Typography
              sx={{
                width: { xs: '40%', md: '30%' },
                textAlign: 'left',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Valor
            </Typography>

            <Typography
              sx={{
                width: { xs: '20%', md: '10%' },
                textAlign: 'center',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Detalhes
            </Typography>
          </Box>

          {/* Lista apenas os itens da página atual */}
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
                  width: { xs: '40%', md: '30%' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.primary',
                }}
              >
                {new Date(service.created_at!).toLocaleDateString('pt-BR')}
              </Typography>

              {!isCompact && (
                <Box sx={{ flex: 1 }}>
                  <Chip
                    label={getServiceType(service)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ fontSize: '0.875rem' }}
                  />
                </Box>
              )}

              <Typography
                sx={{
                  width: { xs: '40%', md: '30%' },
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
                  width: { xs: '20%', md: '10%' },
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

          {/* Paginação */}
          <TablePagination
            component="div"
            count={services.length}
              page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]} // Fixado em 5 itens por página
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            labelRowsPerPage="" // Remove o texto "Linhas por página"
            sx={{
              borderTop: '1px solid #eee',
              '.MuiTablePagination-select': {
                // Esconde o select de itens por página
                display: 'none',
              },
              '.MuiTablePagination-selectLabel': {
                display: 'none',
              },
            }}
          />
        </Box>

        {/* Modal de Detalhes */}
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
                {/* Botão de fechar */}
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
                    pr: 4, // Espaço para o botão de fechar
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
                      const service = servicesMap.get(s.service_id);
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
                            {service?.title} - {s.quantity}x
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
                      const product = productsMap.get(p.product_id);
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
                            {product?.name} - {p.quantity}x
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

                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    Observações:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: 'text.secondary',
                    }}
                  >
                    {selectedService.observations || 'Nenhuma observação'}
                  </Typography>
                </Box>

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
