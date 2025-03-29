import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.code}>{product.code}</Text>
        <Text style={styles.price}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(product.id, quantity - 1)}
        >
          <MaterialIcons name="remove" size={20} color="#007bff" />
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(product.id, quantity + 1)}
        >
          <MaterialIcons name="add" size={20} color="#007bff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotal}>
          R$ {subtotal.toFixed(2).replace('.', ',')}
        </Text>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove(product.id)}
        >
          <MaterialIcons name="delete" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  infoContainer: {
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: '#007bff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 5,
  },
});

export default CartItem;
