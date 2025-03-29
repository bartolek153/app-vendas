import React, { useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import SaleItem from '../components/SaleItem';
import { getAllSales } from '../services/saleService';

const SalesScreen = ({ navigation }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar vendas quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      loadSales();
    }, [])
  );

  // Função para carregar vendas
  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSales();
      setSales(data);
    } catch (err) {
      setError('Erro ao carregar vendas: ' + err.message);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de vendas.');
    } finally {
      setLoading(false);
    }
  };

  // Função para visualizar detalhes da venda
  const handleViewSaleDetails = (sale) => {
    navigation.navigate('SaleDetails', { saleId: sale.id });
  };

  // Renderizar item da lista
  const renderItem = ({ item }) => (
    <SaleItem 
      sale={item} 
      onPress={handleViewSaleDetails}
    />
  );

  // Renderizar conteúdo vazio
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Nenhuma venda registrada</Text>
      <Text style={styles.emptySubtext}>
        As vendas finalizadas aparecerão aqui
      </Text>
      <TouchableOpacity 
        style={styles.newSaleButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.newSaleButtonText}>Nova venda</Text>
      </TouchableOpacity>
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
            onPress={loadSales}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sales}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={sales.length === 0 ? styles.listEmpty : styles.list}
          ListEmptyComponent={renderEmptyList}
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
  list: {
    paddingVertical: 8,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    marginBottom: 20,
  },
  newSaleButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  newSaleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SalesScreen;
