import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SaleItem = ({ sale, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(sale)}>
      <View style={styles.infoContainer}>
        <Text style={styles.code}>{sale.code}</Text>
        <Text style={styles.date}>{formatDate(sale.date)}</Text>
        <Text style={styles.total}>
          Total: R$ {sale.total.toFixed(2).replace('.', ',')}
        </Text>
      </View>
      
      <View style={styles.iconContainer}>
        <MaterialIcons name="chevron-right" size={24} color="#007bff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  infoContainer: {
    flex: 1,
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  iconContainer: {
    marginLeft: 10,
  },
});

export default SaleItem;
