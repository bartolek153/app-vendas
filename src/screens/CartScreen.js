import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { addSale } from '../services/saleService';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const [loading, setLoading] = useState(false);
  
  // Finalizar a compra
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho para finalizar a compra.');
      return;
    }
    
    Alert.alert(
      'Confirmar compra',
      'Deseja finalizar esta compra?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            try {
              setLoading(true);
              
              // Registrar a venda no banco de dados
              const sale = await addSale(cartItems);
              
              // Limpar o carrinho
              clearCart();
              
              // Mostrar mensagem de sucesso
              Alert.alert(
                'Compra finalizada',
                `Venda registrada com sucesso!\nCódigo: ${sale.code}`,
                [
                  { 
                    text: 'Ver histórico', 
                    onPress: () => navigation.navigate('Sales')
                  },
                  { text: 'OK' }
                ]
              );
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível finalizar a compra: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Renderizar item do carrinho
  const renderItem = ({ item }) => (
    <CartItem 
      item={item} 
      onRemove={removeFromCart}
      onUpdateQuantity={updateQuantity}
    />
  );
  
  // Renderizar carrinho vazio
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
      <Text style={styles.emptySubtext}>
        Adicione produtos na tela de produtos
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('Products')}
      >
        <Text style={styles.browseButtonText}>Ver produtos</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Calcular o total da compra
  const total = getTotal();
  
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Processando compra...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.product.id.toString()}
            contentContainerStyle={
              cartItems.length === 0 
                ? styles.listEmpty 
                : styles.list
            }
            ListEmptyComponent={renderEmptyCart}
          />
          
          {cartItems.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </Text>
              </View>
              
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    if (cartItems.length > 0) {
                      Alert.alert(
                        'Limpar carrinho',
                        'Tem certeza que deseja remover todos os itens?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { 
                            text: 'Limpar', 
                            style: 'destructive',
                            onPress: clearCart
                          }
                        ]
                      );
                    }
                  }}
                >
                  <MaterialIcons name="delete" size={20} color="white" />
                  <Text style={styles.clearButtonText}>Limpar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <MaterialIcons name="check-circle" size={20} color="white" />
                  <Text style={styles.checkoutButtonText}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  browseButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
});

export default CartScreen;
