import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getSaleById } from '../services/saleService';

const SaleDetailsScreen = ({ route, navigation }) => {
  const { saleId } = route.params;
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar detalhes da venda
  useEffect(() => {
    loadSaleDetails();
  }, [saleId]);

  const loadSaleDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const saleData = await getSaleById(saleId);
      setSale(saleData);
    } catch (err) {
      setError('Erro ao carregar detalhes da venda: ' + err.message);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da venda.');
    } finally {
      setLoading(false);
    }
  };

  // Formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar item da lista
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemDescription}>{item.product.description}</Text>
        <Text style={styles.itemCode}>{item.product.code}</Text>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemQuantity}>{item.quantity}x</Text>
        <Text style={styles.itemPrice}>
          R$ {item.price.toFixed(2).replace('.', ',')}
        </Text>
        <Text style={styles.itemSubtotal}>
          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </View>
  );

  // Renderizar cabeçalho da lista
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.saleInfo}>
        <Text style={styles.saleCode}>Código: {sale.code}</Text>
        <Text style={styles.saleDate}>Data: {formatDate(sale.date)}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>Produtos</Text>
      </View>
    </View>
  );

  // Renderizar rodapé da lista
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.divider} />
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>
          R$ {sale.total.toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={loadSaleDetails}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sale.items}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  saleInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  saleCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  saleDate: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  listHeader: {
    marginVertical: 8,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  itemInfo: {
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 14,
    color: '#666',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  itemQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  footerContainer: {
    marginTop: 8,
  },
  totalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default SaleDetailsScreen;
